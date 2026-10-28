# ==============================================================================
# SCRIPT GENERATOR LAPORAN TUGAS BESAR WEB PROGRAMMING II DALAM FORMAT DOCX
# ==============================================================================
# Sesuai Panduan Teknis & Instruksional Tugas Besar Web Programming II (UBSI)
# Dosen Pengampu: Agung Sasongko, M.Kom
# Tahun Akademik: 2026/2027
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$outputDocx = "c:\Users\ASUS\Desktop\copy-star-kubu\LAPORAN_TUGAS_BESAR_WEB_PROGRAMMING_2_COPY_STAR_KUBU.docx"
$tempDir = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), [System.Guid]::NewGuid().ToString())

Write-Host "Menyiapkan direktori kerja OpenXML di: $tempDir" -ForegroundColor Cyan
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempDir "_rels") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempDir "word") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempDir "word\_rels") -Force | Out-Null

# -----------------------------------------------------------------------------
# 1. [Content_Types].xml
# -----------------------------------------------------------------------------
$contentTypes = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>
'@
[System.IO.File]::WriteAllText((Join-Path $tempDir "[Content_Types].xml"), $contentTypes, [System.Text.Encoding]::UTF8)

# -----------------------------------------------------------------------------
# 2. _rels/.rels
# -----------------------------------------------------------------------------
$rels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>
'@
[System.IO.File]::WriteAllText((Join-Path $tempDir "_rels\.rels"), $rels, [System.Text.Encoding]::UTF8)

# -----------------------------------------------------------------------------
# 3. word/_rels/document.xml.rels
# -----------------------------------------------------------------------------
$docRels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>
'@
[System.IO.File]::WriteAllText((Join-Path $tempDir "word\_rels\document.xml.rels"), $docRels, [System.Text.Encoding]::UTF8)

# -----------------------------------------------------------------------------
# 4. word/styles.xml
# -----------------------------------------------------------------------------
$styles = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
        <w:sz w:val="24"/>
        <w:color w:val="1F2937"/>
        <w:lang w:val="id-ID"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:line="312" w:lineRule="auto" w:after="120"/>
        <w:jc w:val="both"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:styleId="Normal" w:default="1">
    <w:name w:val="Normal"/>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:pPr>
      <w:keepNext/>
      <w:spacing w:before="360" w:after="160"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:b/>
      <w:sz w:val="30"/>
      <w:color w:val="1E3A8A"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:pPr>
      <w:keepNext/>
      <w:spacing w:before="260" w:after="120"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:b/>
      <w:sz w:val="26"/>
      <w:color w:val="0369A1"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading3">
    <w:name w:val="heading 3"/>
    <w:pPr>
      <w:keepNext/>
      <w:spacing w:before="180" w:after="80"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:b/>
      <w:sz w:val="24"/>
      <w:color w:val="334155"/>
    </w:rPr>
  </w:style>
</w:styles>
'@
[System.IO.File]::WriteAllText((Join-Path $tempDir "word\styles.xml"), $styles, [System.Text.Encoding]::UTF8)

# -----------------------------------------------------------------------------
# 5. Build Document XML
# -----------------------------------------------------------------------------
$sb = New-Object System.Text.StringBuilder

function Escape-Xml([string]$s) {
    if ([string]::IsNullOrEmpty($s)) { return "" }
    return $s.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;").Replace('"', "&quot;").Replace("'", "&apos;")
}

function Emit-P([string]$text, [string]$align="both", [bool]$bold=$false, [bool]$italic=$false, [int]$sz=24, [string]$color="1F2937", [int]$before=0, [int]$after=120, [int]$line=312, [int]$firstLineIndent=0) {
    $val = Escape-Xml $text
    $bXml = if ($bold) { "<w:b/>" } else { "" }
    $iXml = if ($italic) { "<w:i/>" } else { "" }
    $indXml = if ($firstLineIndent -gt 0) { "<w:ind w:firstLine=`"$firstLineIndent`"/>" } else { "" }
    [void]$sb.Append("<w:p><w:pPr><w:jc w:val=`"$align`"/><w:spacing w:before=`"$before`" w:after=`"$after`" w:line=`"$line`" w:lineRule=`"auto`"/>$indXml</w:pPr><w:r><w:rPr>$bXml$iXml<w:sz w:val=`"$sz`"/><w:color w:val=`"$color`"/></w:rPr><w:t xml:space=`"preserve`">$val</w:t></w:r></w:p>")
}

function Emit-CoverP([string]$text, [bool]$bold=$false, [int]$sz=24, [string]$color="1F2937", [int]$before=0, [int]$after=80) {
    Emit-P -text $text -align "center" -bold $bold -italic $false -sz $sz -color $color -before $before -after $after -line 280
}

function Emit-H1([string]$text) {
    $val = Escape-Xml $text
    [void]$sb.Append("<w:p><w:pPr><w:pStyle w:val=`"Heading1`"/><w:spacing w:before=`"380`" w:after=`"160`"/><w:jc w:val=`"left`"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val=`"28`"/><w:color w:val=`"1E3A8A`"/></w:rPr><w:t>$val</w:t></w:r></w:p>")
}

function Emit-H2([string]$text) {
    $val = Escape-Xml $text
    [void]$sb.Append("<w:p><w:pPr><w:pStyle w:val=`"Heading2`"/><w:spacing w:before=`"260`" w:after=`"120`"/><w:jc w:val=`"left`"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val=`"25`"/><w:color w:val=`"0369A1`"/></w:rPr><w:t>$val</w:t></w:r></w:p>")
}

function Emit-H3([string]$text) {
    $val = Escape-Xml $text
    [void]$sb.Append("<w:p><w:pPr><w:pStyle w:val=`"Heading3`"/><w:spacing w:before=`"180`" w:after=`"80`"/><w:jc w:val=`"left`"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val=`"23`"/><w:color w:val=`"334155`"/></w:rPr><w:t>$val</w:t></w:r></w:p>")
}

function Emit-Bullet([string]$prefix, [string]$text) {
    $pVal = Escape-Xml $prefix
    $tVal = Escape-Xml $text
    [void]$sb.Append("<w:p><w:pPr><w:ind w:left=`"540`" w:hanging=`"260`"/><w:spacing w:after=`"90`" w:line=`"280`" w:lineRule=`"auto`"/><w:jc w:val=`"both`"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii=`"Symbol`" w:hAnsi=`"Symbol`"/><w:sz w:val=`"22`"/><w:color w:val=`"0284C7`"/></w:rPr><w:t>&#183;  </w:t></w:r><w:r><w:rPr><w:b/><w:sz w:val=`"23`"/><w:color w:val=`"1E293B`"/></w:rPr><w:t>$pVal </w:t></w:r><w:r><w:rPr><w:sz w:val=`"23`"/><w:color w:val=`"334155`"/></w:rPr><w:t>$tVal</w:t></w:r></w:p>")
}

function Emit-Callout([string]$title, [string]$text) {
    $tVal = Escape-Xml $title
    $cVal = Escape-Xml $text
    [void]$sb.Append("<w:p><w:pPr><w:pBdr><w:left w:val=`"single`" w:sz=`"24`" w:space=`"15`" w:color=`"0284C7`"/></w:pBdr><w:shd w:val=`"clear`" w:color=`"auto`" w:fill=`"F0F9FF`"/><w:spacing w:before=`"140`" w:after=`"140`" w:line=`"280`" w:lineRule=`"auto`"/><w:ind w:left=`"300`" w:right=`"200`"/><w:jc w:val=`"both`"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val=`"23`"/><w:color w:val=`"0369A1`"/></w:rPr><w:t>$tVal`: </w:t></w:r><w:r><w:rPr><w:sz w:val=`"23`"/><w:color w:val=`"0F172A`"/></w:rPr><w:t>$cVal</w:t></w:r></w:p>")
}

function Emit-CodeBlock([string]$code) {
    $cVal = Escape-Xml $code
    [void]$sb.Append("<w:p><w:pPr><w:pBdr><w:left w:val=`"single`" w:sz=`"16`" w:space=`"15`" w:color=`"94A3B8`"/><w:top w:val=`"single`" w:sz=`"8`" w:space=`"10`" w:color=`"E2E8F0`"/><w:right w:val=`"single`" w:sz=`"8`" w:space=`"10`" w:color=`"E2E8F0`"/><w:bottom w:val=`"single`" w:sz=`"8`" w:space=`"10`" w:color=`"E2E8F0`"/></w:pBdr><w:shd w:val=`"clear`" w:color=`"auto`" w:fill=`"F8FAFC`"/><w:spacing w:before=`"120`" w:after=`"120`" w:line=`"240`" w:lineRule=`"auto`"/><w:ind w:left=`"300`" w:right=`"150`"/><w:jc w:val=`"left`"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii=`"Consolas`" w:hAnsi=`"Consolas`"/><w:sz w:val=`"20`"/><w:color w:val=`"0F172A`"/></w:rPr><w:t xml:space=`"preserve`">$cVal</w:t></w:r></w:p>")
}

function Emit-PageBreak {
    [void]$sb.Append("<w:p><w:r><w:br w:type=`"page`"/></w:r></w:p>")
}

function Emit-Table {
    param(
        [array]$Headers,
        [array]$Rows,
        [array]$ColWidths = @(),
        [string]$HeaderBg = "1E3A8A",
        [string]$HeaderColor = "FFFFFF",
        [array]$Alignments = @()
    )
    [void]$sb.Append("<w:tbl>")
    [void]$sb.Append("<w:tblPr><w:tblW w:w=`"9000`" w:type=`"dxa`"/><w:jc w:val=`"center`"/><w:tblBorders><w:top w:val=`"single`" w:sz=`"6`" w:space=`"0`" w:color=`"CBD5E1`"/><w:left w:val=`"single`" w:sz=`"6`" w:space=`"0`" w:color=`"CBD5E1`"/><w:bottom w:val=`"single`" w:sz=`"6`" w:space=`"0`" w:color=`"CBD5E1`"/><w:right w:val=`"single`" w:sz=`"6`" w:space=`"0`" w:color=`"CBD5E1`"/><w:insideH w:val=`"single`" w:sz=`"4`" w:space=`"0`" w:color=`"E2E8F0`"/><w:insideV w:val=`"single`" w:sz=`"4`" w:space=`"0`" w:color=`"E2E8F0`"/></w:tblBorders><w:tblCellMar><w:top w:w=`"120`" w:type=`"dxa`"/><w:bottom w:w=`"120`" w:type=`"dxa`"/><w:left w:w=`"160`" w:type=`"dxa`"/><w:right w:w=`"160`" w:type=`"dxa`"/></w:tblCellMar></w:tblPr>")
    
    # Headers
    if ($Headers.Count -gt 0) {
        [void]$sb.Append("<w:tr><w:trPr><w:tblHeader/></w:trPr>")
        for ($i = 0; $i -lt $Headers.Count; $i++) {
            $hText = Escape-Xml $Headers[$i]
            $wDxa = if ($i -lt $ColWidths.Count) { $ColWidths[$i] } else { 1500 }
            [void]$sb.Append("<w:tc><w:tcPr><w:tcW w:w=`"$wDxa`" w:type=`"dxa`"/><w:shd w:val=`"clear`" w:color=`"auto`" w:fill=`"$HeaderBg`"/></w:tcPr><w:p><w:pPr><w:jc w:val=`"center`"/><w:spacing w:before=`"80`" w:after=`"80`" w:line=`"240`" w:lineRule=`"auto`"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val=`"22`"/><w:color w:val=`"$HeaderColor`"/></w:rPr><w:t>$hText</w:t></w:r></w:p></w:tc>")
        }
        [void]$sb.Append("</w:tr>")
    }

    # Data Rows
    $rIdx = 0
    foreach ($row in $Rows) {
        $rIdx++
        $bg = if ($rIdx % 2 -eq 0) { "F8FAFC" } else { "FFFFFF" }
        [void]$sb.Append("<w:tr>")
        for ($c = 0; $c -lt $row.Count; $c++) {
            $cText = Escape-Xml $row[$c]
            $wDxa = if ($c -lt $ColWidths.Count) { $ColWidths[$c] } else { 1500 }
            $align = if ($c -lt $Alignments.Count) { $Alignments[$c] } else { "left" }
            [void]$sb.Append("<w:tc><w:tcPr><w:tcW w:w=`"$wDxa`" w:type=`"dxa`"/><w:shd w:val=`"clear`" w:color=`"auto`" w:fill=`"$bg`"/></w:tcPr><w:p><w:pPr><w:jc w:val=`"$align`"/><w:spacing w:before=`"60`" w:after=`"60`" w:line=`"240`" w:lineRule=`"auto`"/></w:pPr><w:r><w:rPr><w:sz w:val=`"21`"/><w:color w:val=`"1F2937`"/></w:rPr><w:t xml:space=`"preserve`">$cText</w:t></w:r></w:p></w:tc>")
        }
        [void]$sb.Append("</w:tr>")
    }
    [void]$sb.Append("</w:tbl>")
    # add spacing after table
    [void]$sb.Append("<w:p><w:pPr><w:spacing w:after=`"140`"/></w:pPr></w:p>")
}

Write-Host "Helper functions terdefinisi." -ForegroundColor Green

# -----------------------------------------------------------------------------
# Panggil Seluruh Modul Secara Berurutan
# -----------------------------------------------------------------------------
$scriptRoot = $PSScriptRoot
if ([string]::IsNullOrEmpty($scriptRoot)) {
    $scriptRoot = "c:\Users\ASUS\Desktop\copy-star-kubu"
}

. (Join-Path $scriptRoot "build_part1_frontmatter.ps1")
. (Join-Path $scriptRoot "build_part2_bab1_bab2.ps1")
. (Join-Path $scriptRoot "build_part3_bab3_backend.ps1")
. (Join-Path $scriptRoot "build_part4_bab4_bab5_bab6.ps1")
. (Join-Path $scriptRoot "build_part5_appendices_and_zip.ps1")

# Eksekusi Penyusunan Dokumen
Generate-FrontMatter
Generate-Bab1-Bab2
Generate-Bab3-Backend
Generate-Bab4-Bab5-Bab6
Generate-Appendices-And-Zip

