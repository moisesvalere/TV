@echo off
REM Cambia al directorio de tu proyecto
cd /d C:\xampp\htdocs\ext

REM Agrega todos los archivos
git add .

REM Haz un commit con un mensaje que incluye la fecha y hora
git commit -m "Automated commit on %date% %time%"

REM Empuja los cambios al repositorio remoto
git push

REM Muestra un mensaje de éxito
echo "Cambios sincronizados con éxito."
