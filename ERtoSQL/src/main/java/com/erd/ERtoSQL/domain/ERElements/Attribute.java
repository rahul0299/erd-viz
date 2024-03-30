package com.erd.ERtoSQL.domain.ERElements;


import lombok.Data;

@Data
public class Attribute implements Node {

    String name;

    String dataType;

    public Attribute(String name) {
        this.name = name;
    }
}
