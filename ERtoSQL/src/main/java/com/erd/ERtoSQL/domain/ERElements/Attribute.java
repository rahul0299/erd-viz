package com.erd.ERtoSQL.domain.ERElements;


import lombok.Data;

@Data
public class Attribute implements Node {

    String name;

    String dataType;

    Boolean isNullable;

    Boolean isPrimary;

    public Attribute(String name) {
        this.name = name;
    }
}
