package com.erd.ERtoSQL.domain.ERElements;

import lombok.Data;

import java.util.List;

@Data
public class Relation extends Structure implements Node {

    String name;

    public Relation(String name) {
        this.name = name;
    }

}
