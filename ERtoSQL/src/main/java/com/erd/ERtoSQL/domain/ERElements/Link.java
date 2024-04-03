package com.erd.ERtoSQL.domain.ERElements;

import lombok.Data;

@Data
public class Link {
    String lowerBound;
    String upperBound;
    String from;
    String to;

    public Link(String lowerBound, String upperBound, String from, String to) {
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
        this.from = from;
        this.to = to;
    }
}
