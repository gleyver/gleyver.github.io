export class FileReaderService {
  static readFile(file, format) {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = function(event) {
              const data = event.target.result;
              if (format === 'xlsx') {
                  resolve(FileReaderService.parseXLSX(data));
              } else if (format === 'csv') {
                  resolve(FileReaderService.parseCSV(data));
              } else {
                  reject(new Error('Formato de arquivo não suportado'));
              }
          };
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
      });
  }

  static parseXLSX(data) {
      // Lê o arquivo XLSX usando FileReader
      const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      return XLSX.utils.sheet_to_json(sheet, { header: 1 });
  }

  static parseCSV(data) {
      // Lê o arquivo CSV usando FileReader
      const text = new TextDecoder().decode(new Uint8Array(data));
      return text.trim().split('\n').map(row => row.split(','));
  }
}
