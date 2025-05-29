package com.softwareengineering9.toeicVoca.domain;

import java.util.List;

public class ProgressData {
    private List<String> completedDates;

    public ProgressData() {}

    public ProgressData(List<String> completedDates) {
        this.completedDates = completedDates;
    }

    public List<String> getCompletedDates() {
        return completedDates;
    }

    public void setCompletedDates(List<String> completedDates) {
        this.completedDates = completedDates;
    }
}
