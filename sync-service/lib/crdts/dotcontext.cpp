// Autonomous causal context, for context sharing in maps
template<typename K>
class dotcontext
{
public:
  map<K,int> cc; // Compact causal context
  set<pair<K,int> > dc; // Dot cloud

  dotcontext<K> & operator=(const dotcontext<K> & o)
  {
    if (&o == this) return *this;
    cc=o.cc; dc=o.dc;
    return *this;
  }

  friend ostream &operator<<( ostream &output, const dotcontext<K>& o)
  { 
    output << "Context:";
    output << " CC ( ";
    for (const auto & ki : o.cc)
      output << ki.first << ":" << ki.second << " ";
    output << ")";
    output << " DC ( ";
    for (const auto & ki : o.dc)
      output << ki.first << ":" << ki.second << " ";
    output << ")";
    return output;            
  }

  bool dotin (const pair<K,int> & d) const
  {
    const auto itm = cc.find(d.first);
    if (itm != cc.end() && d.second <= itm->second) return true;
    if (dc.count(d)!=0) return true;
    return false;
  }

  void compact()
  {
    // Compact DC to CC if possible
    //typename map<K,int>::iterator mit;
    //typename set<pair<K,int> >::iterator sit;
    bool flag; // may need to compact several times if ordering not best
    do
    {
      flag=false;
      for(auto sit = dc.begin(); sit != dc.end();)
      {
        auto mit=cc.find(sit->first); 
        if (mit==cc.end()) // No CC entry
          if (sit->second == 1) // Can compact
          {
            cc.insert(*sit);
            dc.erase(sit++);
            flag=true;
          }
          else ++sit;
        else // there is a CC entry already
          if (sit->second == cc.at(sit->first) + 1) // Contiguous, can compact
          {
            cc.at(sit->first)++;
            dc.erase(sit++);
            flag=true;
          }
          else 
            if (sit->second <= cc.at(sit->first)) // dominated, so prune
            {
              dc.erase(sit++);
              // no extra compaction oportunities so flag untouched
            }
            else ++sit;
      }
    }
    while(flag==true);
  }

  pair<K,int> makedot(const K & id)
  {
    // On a valid dot generator, all dots should be compact on the used id
    // Making the new dot, updates the dot generator and returns the dot
    // pair<typename map<K,int>::iterator,bool> ret;
    auto kib=cc.insert(pair<K,int>(id,1));
    if (kib.second==false) // already there, so update it
      (kib.first->second)+=1;
    //return dot;
    return pair<K,int>(*kib.first);
  }

  void insertdot(const pair<K,int> & d, bool compactnow=true)
  {
    // Set
    dc.insert(d);
    if (compactnow) compact();
  }


  void join (const dotcontext<K> & o)
  {
    if (this == &o) return; // Join is idempotent, but just dont do it.
    // CC
    //typename  map<K,int>::iterator mit;
    //typename  map<K,int>::const_iterator mito;
    auto mit=cc.begin(); auto mito=o.cc.begin();
    do 
    {
      if (mit != cc.end() && (mito == o.cc.end() || mit->first < mito->first))
      {
        // cout << "cc one\n";
        // entry only at here
        ++mit;
      }
      else if (mito != o.cc.end() && (mit == cc.end() || mito->first < mit->first))
      {
        // cout << "cc two\n";
        // entry only at other
        cc.insert(*mito);
        ++mito;
      }
      else if ( mit != cc.end() && mito != o.cc.end() )
      {
        // cout << "cc three\n";
        // in both
        cc.at(mit->first)=max(mit->second,mito->second);
        ++mit; ++mito;
      }
    } while (mit != cc.end() || mito != o.cc.end());
    // DC
    // Set
    for (const auto & e : o.dc)
      insertdot(e,false);

    compact();

  }

};