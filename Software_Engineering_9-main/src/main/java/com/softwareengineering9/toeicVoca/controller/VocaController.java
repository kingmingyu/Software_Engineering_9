package com.softwareengineering9.toeicVoca.controller;

import com.softwareengineering9.toeicVoca.Entity.Voca;
import com.softwareengineering9.toeicVoca.dto.VocaForm;
import com.softwareengineering9.toeicVoca.service.VocaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/voca")
public class VocaController {

    @Autowired
    private VocaService vocaService;

    @GetMapping("/list")
    public ResponseEntity<Page<Voca>> getVocaList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "40") int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return ResponseEntity.ok(vocaService.getVocaList(pageRequest));
    }

    @PostMapping
    public ResponseEntity<Voca> createVoca(@RequestBody VocaForm vocaForm) {
        return ResponseEntity.ok(vocaService.createVoca(vocaForm));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVoca(@PathVariable Long id) {
        vocaService.deleteVoca(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Voca> updateVoca(
            @PathVariable Long id,
            @RequestBody VocaForm vocaForm) {
        return ResponseEntity.ok(vocaService.updateVoca(id, vocaForm));
    }
}