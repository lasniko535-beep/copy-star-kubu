$docPath = "c:\Users\ASUS\Desktop\copy-star-kubu\LAPORAN_TUGAS_BESAR_WEB_PROGRAMMING_2_COPY_STAR_KUBU_REVISI.docx"

Write-Host "1. Testing XML parsing of document.xml inside docx..."
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zip = [System.IO.Compression.ZipFile]::OpenRead($docPath)
$entry = $zip.GetEntry("word/document.xml")
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
$xmlText = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()

try {
    $xmlDoc = New-Object System.Xml.XmlDocument
    $xmlDoc.LoadXml($xmlText)
    Write-Host "XML is 100% syntactically well-formed! Total elements: " $xmlDoc.DocumentElement.ChildNodes.Count -ForegroundColor Green
} catch {
    Write-Host "XML PARSE ERROR: " $_.Exception.Message -ForegroundColor Red
}

Write-Host "2. Testing if Microsoft Word COM can open it..."
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0 # wdAlertsNone
    $doc = $word.Documents.Open($docPath)
    Write-Host "Word opened the document successfully! Paragraphs count: " $doc.Paragraphs.Count -ForegroundColor Green
    
    # Save a clean standardized version
    $cleanPath = "c:\Users\ASUS\Desktop\copy-star-kubu\Laporan_Web_Programming_2_Copy_Star_Kubu.docx"
    $doc.SaveAs2($cleanPath, 16) # 16 = wdFormatXMLDocument (.docx)
    Write-Host "Word re-saved clean standardized docx to: $cleanPath" -ForegroundColor Green
    
    # Export to PDF as well so user can send PDF on WA if desired!
    $pdfPath = "c:\Users\ASUS\Desktop\copy-star-kubu\Laporan_Web_Programming_2_Copy_Star_Kubu.pdf"
    $doc.SaveAs2($pdfPath, 17) # 17 = wdFormatPDF
    Write-Host "Word exported official PDF to: $pdfPath" -ForegroundColor Green

    $doc.Close()
    $word.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    Write-Host "WORD_COM_TEST_PASSED" -ForegroundColor Green
} catch {
    Write-Host "Word COM Error: " $_.Exception.Message -ForegroundColor Yellow
}
