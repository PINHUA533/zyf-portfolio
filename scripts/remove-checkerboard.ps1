param(
  [Parameter(Mandatory = $true)][string]$InputPath,
  [Parameter(Mandatory = $true)][string]$OutputPath,
  [switch]$CropToContent
)

Add-Type -AssemblyName System.Drawing

$source = [System.Drawing.Bitmap]::FromFile((Resolve-Path -LiteralPath $InputPath))
$bitmap = New-Object System.Drawing.Bitmap($source.Width, $source.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.DrawImage($source, 0, 0, $source.Width, $source.Height)
$graphics.Dispose()
$source.Dispose()

$width = $bitmap.Width
$height = $bitmap.Height
$rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$data = $bitmap.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bytes = New-Object byte[] ($data.Stride * $height)
[System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length)

$visited = New-Object bool[] ($width * $height)
$queue = New-Object int[] ($width * $height)
$head = 0
$tail = 0

function Test-BackgroundPixel([int]$x, [int]$y) {
  $offset = $y * $data.Stride + $x * 4
  $b = [int]$bytes[$offset]
  $g = [int]$bytes[$offset + 1]
  $r = [int]$bytes[$offset + 2]
  $max = [Math]::Max($r, [Math]::Max($g, $b))
  $min = [Math]::Min($r, [Math]::Min($g, $b))
  return ($min -ge 210 -and ($max - $min) -le 22)
}

function Add-Pixel([int]$x, [int]$y) {
  if ($x -lt 0 -or $x -ge $width -or $y -lt 0 -or $y -ge $height) { return }
  $index = $y * $width + $x
  if ($visited[$index] -or -not (Test-BackgroundPixel $x $y)) { return }
  $visited[$index] = $true
  $queue[$tail] = $index
  $script:tail++
}

for ($x = 0; $x -lt $width; $x++) {
  Add-Pixel $x 0
  Add-Pixel $x ($height - 1)
}
for ($y = 0; $y -lt $height; $y++) {
  Add-Pixel 0 $y
  Add-Pixel ($width - 1) $y
}

while ($head -lt $tail) {
  $index = $queue[$head]
  $head++
  $x = $index % $width
  $y = [Math]::Floor($index / $width)
  Add-Pixel ($x - 1) $y
  Add-Pixel ($x + 1) $y
  Add-Pixel $x ($y - 1)
  Add-Pixel $x ($y + 1)
}

for ($index = 0; $index -lt $visited.Length; $index++) {
  if ($visited[$index]) {
    $x = $index % $width
    $y = [Math]::Floor($index / $width)
    $bytes[$y * $data.Stride + $x * 4 + 3] = 0
  }
}

[System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $data.Scan0, $bytes.Length)
$bitmap.UnlockBits($data)

if ($CropToContent) {
  $minX = $width
  $minY = $height
  $maxX = -1
  $maxY = -1

  for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
      if ($bytes[$y * $data.Stride + $x * 4 + 3] -gt 8) {
        if ($x -lt $minX) { $minX = $x }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }

  if ($maxX -ge $minX -and $maxY -ge $minY) {
    $padding = [Math]::Round([Math]::Min($width, $height) * 0.018)
    $cropX = [Math]::Max(0, $minX - $padding)
    $cropY = [Math]::Max(0, $minY - $padding)
    $cropRight = [Math]::Min($width - 1, $maxX + $padding)
    $cropBottom = [Math]::Min($height - 1, $maxY + $padding)
    $cropRect = New-Object System.Drawing.Rectangle($cropX, $cropY, ($cropRight - $cropX + 1), ($cropBottom - $cropY + 1))
    $cropped = $bitmap.Clone($cropRect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $cropped.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropped.Dispose()
  } else {
    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  }
} else {
  $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
}

$bitmap.Dispose()
