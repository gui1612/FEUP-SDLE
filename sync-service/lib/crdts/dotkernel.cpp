template <typename T, typename K>
class dotkernel
{
public:

  map<pair<K,int>,T> ds;  // Map of dots to vals

  dotcontext<K> cbase;
  dotcontext<K> & c;

  // if no causal context supplied, used base one
  dotkernel() : c(cbase) {} 
  // if supplied, use a shared causal context
  dotkernel(dotcontext<K> &jointc) : c(jointc) {} 
//  dotkernel(const dotkernel<T,K> &adk) : c(adk.c), ds(adk.ds) {}

  dotkernel<T,K> & operator=(const dotkernel<T,K> & adk)
  {
    if (&adk == this) return *this;
    if (&c != &adk.c) c=adk.c; 
    ds=adk.ds;
    return *this;
  }

  friend ostream &operator<<( ostream &output, const dotkernel<T,K>& o)
  { 
    output << "Kernel: DS ( ";
    for (const auto & dv : o.ds)
      output <<  dv.first.first << ":" << dv.first.second << 
        "->" << dv.second << " ";
    output << ") ";

    cout << o.c;

    return output;            
  }

  void join (const dotkernel<T,K> & o)
  {
    if (this == &o) return; // Join is idempotent, but just dont do it.
    // DS
    // will iterate over the two sorted sets to compute join
    //typename  map<pair<K,int>,T>::iterator it;
    //typename  map<pair<K,int>,T>::const_iterator ito;
    auto it=ds.begin(); auto ito=o.ds.begin();
    do 
    {
      if ( it != ds.end() && ( ito == o.ds.end() || it->first < ito->first))
      {
        // dot only at this
        if (o.c.dotin(it->first)) // other knows dot, must delete here 
          ds.erase(it++);
        else // keep it
          ++it;
      }
      else if ( ito != o.ds.end() && ( it == ds.end() || ito->first < it->first))
      {
        // dot only at other
        if(! c.dotin(ito->first)) // If I dont know, import
          ds.insert(*ito);
        ++ito;
      }
      else if ( it != ds.end() && ito != o.ds.end() )
      {
        // dot in both
        ++it; ++ito;
      }
    } while (it != ds.end() || ito != o.ds.end() );
    // CC
    c.join(o.c);
  }

  void deepjoin (const dotkernel<T,K> & o)
  {
    if (this == &o) return; // Join is idempotent, but just dont do it.
    // DS
    // will iterate over the two sorted sets to compute join
    //typename  map<pair<K,int>,T>::iterator it;
    //typename  map<pair<K,int>,T>::const_iterator ito;
    auto it=ds.begin(); auto ito=o.ds.begin();
    do 
    {
      if ( it != ds.end() && ( ito == o.ds.end() || it->first < ito->first))
      {
        // dot only at this
        if (o.c.dotin(it->first)) // other knows dot, must delete here 
          ds.erase(it++);
        else // keep it
          ++it;
      }
      else if ( ito != o.ds.end() && ( it == ds.end() || ito->first < it->first))
      {
        // dot only at other
        if(! c.dotin(ito->first)) // If I dont know, import
          ds.insert(*ito);
        ++ito;
      }
      else if ( it != ds.end() && ito != o.ds.end() )
      {
        // dot in both
        // check it payloads are diferent 
        if (it->second != ito->second)
        {
          // if payloads are not equal, they must be mergeable
          // use the more general binary join
          it->second=::join(it->second,ito->second);
        }
        ++it; ++ito;
      }
    } while (it != ds.end() || ito != o.ds.end() );
    // CC
    c.join(o.c);
  }


  dotkernel<T,K> add (const K& id, const T& val) 
  {
    dotkernel<T,K> res;
    // get new dot
    pair<K,int> dot=c.makedot(id);
    // add under new dot
    ds.insert(pair<pair<K,int>,T>(dot,val));
    // make delta
    res.ds.insert(pair<pair<K,int>,T>(dot,val));
    res.c.insertdot(dot);
    return res;
  }

  // Add that returns the added dot, instead of kernel delta
  pair<K,int> dotadd (const K& id, const T& val)
  {
    // get new dot
    pair<K,int> dot=c.makedot(id);
    // add under new dot
    ds.insert(pair<pair<K,int>,T>(dot,val));
    return dot;
  }

  dotkernel<T,K> rmv (const T& val)  // remove all dots matching value
  {
    dotkernel<T,K> res;
    //typename  map<pair<K,int>,T>::iterator dsit;
    for(auto dsit=ds.begin(); dsit != ds.end();)
    {
      if (dsit->second == val) // match
      {
        res.c.insertdot(dsit->first,false); // result knows removed dots
        ds.erase(dsit++);
      }
      else
        ++dsit;
    }
    res.c.compact(); // Maybe several dots there, so atempt compactation
    return res;
  }

  dotkernel<T,K> rmv (const pair<K,int>& dot)  // remove a dot 
  {
    dotkernel<T,K> res;
    auto dsit=ds.find(dot);
    if (dsit != ds.end()) // found it
    {
      res.c.insertdot(dsit->first,false); // result knows removed dots
      ds.erase(dsit++);
    }
    res.c.compact(); // Atempt compactation
    return res;
  }

  dotkernel<T,K> rmv ()  // remove all dots 
  {
    dotkernel<T,K> res;
    for (const auto & dv : ds) 
      res.c.insertdot(dv.first,false);
    res.c.compact();
    ds.clear(); // Clear the payload, but remember context
    return res;
  }

};