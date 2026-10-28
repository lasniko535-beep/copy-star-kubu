$src = "c:\Users\ASUS\Desktop\copy-star-kubu\Laporan_Web_Programming_2_Copy_Star_Kubu.docx"
$dst1 = "c:\Users\ASUS\Desktop\copy-star-kubu\LAPORAN_TUGAS_BESAR_WEB_PROGRAMMING_2_COPY_STAR_KUBU.docx"
$dst2 = "c:\Users\ASUS\Desktop\copy-star-kubu\LAPORAN_TUGAS_BESAR_WEB_PROGRAMMING_2_COPY_STAR_KUBU_REVISI.docx"

try { Copy-Item $src $dst1 -Force } catch { Write-Host "dst1 locked: $($_.Exception.Message)" }
try { Copy-Item $src $dst2 -Force } catch { Write-Host "dst2 locked: $($_.Exception.Message)" }
Write-Host "SYNC DONE"
