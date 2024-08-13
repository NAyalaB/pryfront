export function isBirthdayValid(birthday?: string): boolean {
    if (!birthday) return false; // Si no se proporciona la fecha, no es válida
    
    const selectedDate = new Date(birthday);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - selectedDate.getFullYear();
    
    // Ajustar el cálculo si el cumpleaños aún no ha ocurrido en este año
    const hasHadBirthdayThisYear = (
        currentDate.getMonth() > selectedDate.getMonth() ||
        (currentDate.getMonth() === selectedDate.getMonth() && currentDate.getDate() >= selectedDate.getDate())
    );
    
    const actualAge = hasHadBirthdayThisYear ? age : age - 1;
    
    return actualAge >= 18; // La persona debe ser mayor o igual a 18 años
}
