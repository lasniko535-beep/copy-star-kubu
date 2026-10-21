# Script PowerShell untuk menghasilkan dokumen Microsoft Word (.docx) dari file JSON
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$jsonPath = "c:\Users\ASUS\Desktop\copy-star-kubu\dokumen_konten.json"
$outputDocx = "c:\Users\ASUS\Desktop\copy-star-kubu\PENJELASAN_DAN_KEUNGGULAN_FITUR_COPY_STAR_KUBU.docx"

$jsonRaw = [System.IO.File]::ReadAllText($jsonPath, [System.Text.Encoding]::UTF8)
$data = $jsonRaw | ConvertFrom-Json

$tempDir = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), [System.Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempDir "_rels") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempDir "word") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempDir "word\_rels") -Force | Out-Null

# 1. [Content_Types].xml
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

# 2. _rels/.rels
$rels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>
'@
[System.IO.File]::WriteAllText((Join-Path $tempDir "_rels\.rels"), $rels, [System.Text.Encoding]::UTF8)

# 3. word/_rels/document.xml.rels
$docRels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>
'@
[System.IO.File]::WriteAllText((Join-Path $tempDir "word\_rels\document.xml.rels"), $docRels, [System.Text.Encoding]::UTF8)

# 4. word/styles.xml
$styles = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
        <w:sz w:val="22"/>
        <w:color w:val="222222"/>
        <w:lang w:val="id-ID"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:line="276" w:lineRule="auto" w:after="140"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:styleId="Normal" w:default="1">
    <w:name w:val="Normal"/>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:pPr>
      <w:spacing w:before="360" w:after="140"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
      <w:b/>
      <w:sz w:val="30"/>
      <w:color w:val="1E3A8A"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:pPr>
      <w:spacing w:before="240" w:after="100"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
      <w:b/>
      <w:sz w:val="26"/>
      <w:color w:val="0369A1"/>
    </w:rPr>
  </w:style>
</w:styles>
'@
[System.IO.File]::WriteAllText((Join-Path $tempDir "word\styles.xml"), $styles, [System.Text.Encoding]::UTF8)

# 5. Build Document Body
$sb = New-Object System.Text.StringBuilder

function Escape-Xml([string]$str) {
    if ([string]::IsNullOrEmpty($str)) { return "" }
    return $str.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;").Replace('"', "&quot;").Replace("'", "&apos;")
}

function Emit-Title([string]$text) {
    $val = Escape-Xml $text
    [void]$sb.Append("<w:p><w:pPr><w:jc w:val=`"center`"/><w:spacing w:before=`"200`" w:after=`"120`"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val=`"36`"/><w:color w:val=`"1E3A8A`"/></w:rPr><w:t>$val</w:t></w:r></w:p>")
}

function Emit-Subtitle([string]$text) {
    $val = Escape-Xml $text
    [void]$sb.Append("<w:p><w:pPr><w:jc w:val=`"center`"/><w:spacing w:before=`"0`" w:after=`"260`"/></w:pPr><w:r><w:rPr><w:i/><w:sz w:val=`"24`"/><w:color w:val=`"475569`"/></w:rPr><w:t>$val</w:t></w:r></w:p>")
}

function Emit-Heading1([string]$text) {
    $val = Escape-Xml $text
    [void]$sb.Append("<w:p><w:pPr><w:pStyle w:val=`"Heading1`"/><w:spacing w:before=`"340`" w:after=`"140`"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val=`"28`"/><w:color w:val=`"1E3A8A`"/></w:rPr><w:t>$val</w:t></w:r></w:p>")
}

function Emit-Heading2([string]$text) {
    $val = Escape-Xml $text
    [void]$sb.Append("<w:p><w:pPr><w:pStyle w:val=`"Heading2`"/><w:spacing w:before=`"240`" w:after=`"100`"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val=`"25`"/><w:color w:val=`"0369A1`"/></w:rPr><w:t>$val</w:t></w:r></w:p>")
}

function Emit-Paragraph([string]$text) {
    $val = Escape-Xml $text
    [void]$sb.Append("<w:p><w:pPr><w:jc w:val=`"both`"/><w:spacing w:after=`"140`" w:line=`"276`" w:lineRule=`"auto`"/></w:pPr><w:r><w:rPr><w:sz w:val=`"22`"/><w:color w:val=`"222222`"/></w:rPr><w:t>$val</w:t></w:r></w:p>")
}

function Emit-Callout([string]$title, [string]$text) {
    $tVal = Escape-Xml $title
    $cVal = Escape-Xml $text
    [void]$sb.Append("<w:p><w:pPr><w:pBdr><w:left w:val=`"single`" w:sz=`"24`" w:space=`"15`" w:color=`"0284C7`"/></w:pBdr><w:shd w:val=`"clear`" w:color=`"auto`" w:fill=`"F0F9FF`"/><w:spacing w:before=`"140`" w:after=`"140`" w:line=`"276`" w:lineRule=`"auto`"/><w:ind w:left=`"280`" w:right=`"140`"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val=`"22`"/><w:color w:val=`"0369A1`"/></w:rPr><w:t>$tVal`: </w:t></w:r><w:r><w:rPr><w:i/><w:sz w:val=`"22`"/><w:color w:val=`"0F172A`"/></w:rPr><w:t>$cVal</w:t></w:r></w:p>")
}

function Emit-Bullet([string]$prefix, [string]$text) {
    $pVal = Escape-Xml $prefix
    $tVal = Escape-Xml $text
    [void]$sb.Append("<w:p><w:pPr><w:ind w:left=`"420`" w:hanging=`"210`"/><w:spacing w:after=`"100`" w:line=`"260`" w:lineRule=`"auto`"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii=`"Symbol`" w:hAnsi=`"Symbol`"/><w:sz w:val=`"20`"/><w:color w:val=`"0284C7`"/></w:rPr><w:t>&#183;  </w:t></w:r><w:r><w:rPr><w:b/><w:sz w:val=`"22`"/><w:color w:val=`"1E293B`"/></w:rPr><w:t>$pVal </w:t></w:r><w:r><w:rPr><w:sz w:val=`"22`"/><w:color w:val=`"334155`"/></w:rPr><w:t>$tVal</w:t></w:r></w:p>")
}

# Parsing data JSON
Emit-Title $data.title
Emit-Subtitle $data.subtitle
Emit-Callout $data.callout_title $data.callout_text

foreach ($sec in $data.sections) {
    if ($sec.heading1) {
        Emit-Heading1 $sec.heading1
    }
    if ($sec.paragraphs) {
        foreach ($p in $sec.paragraphs) {
            Emit-Paragraph $p
        }
    }
    if ($sec.bullets) {
        foreach ($b in $sec.bullets) {
            Emit-Bullet $b.prefix $b.text
        }
    }
    if ($sec.subsections) {
        foreach ($sub in $sec.subsections) {
            if ($sub.heading2) {
                Emit-Heading2 $sub.heading2
            }
            if ($sub.paragraph) {
                Emit-Paragraph $sub.paragraph
            }
            if ($sub.bullets) {
                foreach ($sbItem in $sub.bullets) {
                    Emit-Bullet $sbItem.prefix $sbItem.text
                }
            }
        }
    }
}

# Susun dokumen XML
$docXmlHeader = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
'@
$docXmlFooter = @'
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>
'@

$finalDocXml = $docXmlHeader + $sb.ToString() + $docXmlFooter
[System.IO.File]::WriteAllText((Join-Path $tempDir "word\document.xml"), $finalDocXml, [System.Text.Encoding]::UTF8)

# Hapus file lama jika ada, lalu kompresi ke .docx
if (Test-Path $outputDocx) {
    Remove-Item $outputDocx -Force
}

[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $outputDocx)

# Bersihkan direktori temporary
Remove-Item -Path $tempDir -Recurse -Force | Out-Null

Write-Output "SUKSES: Dokumen Word berhasil dibuat di $outputDocx"
