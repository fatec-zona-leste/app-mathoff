Write-Host "Limpando projeto..."

# Pastas que atrapalham
$folders = @("node_modules", ".expo", ".parcel", ".cache")

foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Write-Host "Removendo $folder ..."
        Remove-Item -Recurse -Force $folder
    } else {
        Write-Host "Pasta $folder não encontrada, pulando..."
    }
}

# Remover lockfiles
if (Test-Path "package-lock.json") {
    Write-Host "Removendo package-lock.json ..."
    Remove-Item -Force "package-lock.json"
}
if (Test-Path "yarn.lock") {
    Write-Host "Removendo yarn.lock ..."
    Remove-Item -Force "yarn.lock"
}

Write-Host "Instalando dependências do projeto..."
npm install

Write-Host "Forçando versões corretas do React e React Native..."
npm install react@18.2.0 react-dom@18.2.0 react-native@0.74.5 --save

Write-Host "Checando versões instaladas..."
npm ls react react-dom react-native

Write-Host "Iniciando projeto no Expo (cache limpo)..."
npx expo start -c
