Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$outputDirectory = Join-Path $root 'public\images\content'

New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null

function Export-Crop {
  param(
    [Parameter(Mandatory)]
    [string]$Source,
    [Parameter(Mandatory)]
    [string]$Destination,
    [Parameter(Mandatory)]
    [int]$X,
    [Parameter(Mandatory)]
    [int]$Y,
    [Parameter(Mandatory)]
    [int]$Width,
    [Parameter(Mandatory)]
    [int]$Height
  )

  $sourceImage = [System.Drawing.Bitmap]::FromFile($Source)
  $cropBounds = [System.Drawing.Rectangle]::new($X, $Y, $Width, $Height)
  $crop = $sourceImage.Clone($cropBounds, $sourceImage.PixelFormat)
  $crop.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Png)
  $crop.Dispose()
  $sourceImage.Dispose()
}

$heroSource = Join-Path $root 'imagens\mockups\header_and_hero.png'
$structureSource = Join-Path $root 'imagens\mockups\especialidade_and_structure.png'
$locationSource = Join-Path $root 'imagens\mockups\avaliation_and_location.png'

Export-Crop -Source $heroSource -Destination (Join-Path $outputDirectory 'paciente-gato.png') -X 640 -Y 334 -Width 255 -Height 548
Export-Crop -Source $heroSource -Destination (Join-Path $outputDirectory 'paciente-golden.png') -X 852 -Y 268 -Width 392 -Height 632
Export-Crop -Source $heroSource -Destination (Join-Path $outputDirectory 'paciente-pequeno.png') -X 1182 -Y 358 -Width 278 -Height 520
Export-Crop -Source $structureSource -Destination (Join-Path $outputDirectory 'consultorio-provisorio.png') -X 62 -Y 684 -Width 668 -Height 404
Export-Crop -Source $locationSource -Destination (Join-Path $outputDirectory 'fachada-provisoria.png') -X 40 -Y 602 -Width 638 -Height 396

Write-Output "Assets provisórios exportados para $outputDirectory"
