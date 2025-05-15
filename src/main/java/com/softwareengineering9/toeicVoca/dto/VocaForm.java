package com.softwareengineering9.toeicVoca.dto;

import com.softwareengineering9.toeicVoca.Entity.Voca;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@Setter
public class VocaForm {
    private String spelling;
    private String meaning;

    public Voca toEntity(){
        return new Voca(spelling, meaning);
    }
}
