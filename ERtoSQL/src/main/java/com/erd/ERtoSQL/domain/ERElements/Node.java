package com.erd.ERtoSQL.domain.ERElements;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public abstract class Node {
    List<String> attributes;

    String primaryKey;

    String name;

    List<Link> links;

    public Node(String name, String primaryKey, List<Object> attributes) {
        this.name = name;
        this.primaryKey = primaryKey;
        this.attributes = attributes.stream().map(Object::toString).collect(Collectors.toList());
        links = new ArrayList<>();
    }

    public Node() {
        links = new ArrayList<>();
    }

//    public void addToAttributes(String attribute){
//        if(attribute.isPrimary!=null && attribute.isPrimary){
//            primaryKey=attribute;
//        } else {
//            attributes.add(attribute);
//        }
//
//    }

}
