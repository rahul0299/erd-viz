package com.erd.ERtoSQL.domain.ERElements;

import lombok.Data;

import java.util.List;

@Data
public class Relation extends  Node {


    public Relation(String name) {
        this.name = name;
    }

}
