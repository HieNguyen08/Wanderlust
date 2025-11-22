package com.wanderlust.api.controller;

import com.wanderlust.api.dto.search.SearchResultDTO;
import com.wanderlust.api.services.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/global")
    public ResponseEntity<List<SearchResultDTO>> globalSearch(@RequestParam String query) {
        List<SearchResultDTO> results = searchService.globalSearch(query);
        return ResponseEntity.ok(results);
    }
}
