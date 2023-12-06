package pt.up.fe.sdle2023.db.config;

public class Node {

    private String name;
    private String address;

    /*public Node(String name, String address) {
        this.name = name;
        this.address = address;
    }*/

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return "Node{" +
                "address='" + address + '\'' +
                '}';
    }
}
