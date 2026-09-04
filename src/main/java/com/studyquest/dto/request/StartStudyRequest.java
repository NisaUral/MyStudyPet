package com.studyquest.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StartStudyRequest {

    @NotNull(message = "Hedef çalışma süresi girilmelidir")
    @Min(value = 5, message = "Çalışma seansı en az 5 dakika olmalıdır")
    @Max(value = 360, message = "Tek seferde en fazla 360 dakika çalışılabilir")
    private Integer targetDurationMinutes;
}