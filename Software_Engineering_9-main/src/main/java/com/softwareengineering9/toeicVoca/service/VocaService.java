package com.softwareengineering9.toeicVoca.service;

import com.softwareengineering9.toeicVoca.Entity.Voca;
import com.softwareengineering9.toeicVoca.dto.VocaForm;
import com.softwareengineering9.toeicVoca.repository.VocaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VocaService {

    @Autowired
    private VocaRepository vocaRepository;

    public Page<Voca> getVocaList(Pageable pageable) {
        return vocaRepository.findAll(pageable);
    }

    @Transactional
    public Voca createVoca(VocaForm vocaForm) {
        return vocaRepository.save(vocaForm.toEntity());
    }

    @Transactional
    public void deleteVoca(Long id) {
        vocaRepository.deleteById(id);
    }

    @Transactional
    public Voca updateVoca(Long id, VocaForm vocaForm) {
        Voca voca = vocaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("단어를 찾을 수 없습니다."));

        voca.updateVoca(vocaForm.getSpelling(), vocaForm.getMeaning());
        return vocaRepository.save(voca);
    }
}
