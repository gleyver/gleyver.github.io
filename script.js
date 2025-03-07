import { FileReaderService } from './FileReaderService.js';

document.getElementById('compareForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const file1 = document.getElementById('file1').files[0];
    console.log("🚀 ~ document.getElementById ~ file1:", file1);
    const file2 = document.getElementById("file2").files[0];
    console.log("🚀 ~ document.getElementById ~ file2:", file2);
    const format = document.getElementById("format").value;
    console.log("🚀 ~ document.getElementById ~ format:", format);
    const column1 = parseInt(document.getElementById("column1").value, 10) - 1;
    const column2 = parseInt(document.getElementById("column2").value, 10) - 1;
    const batchSize = 1000;
    const extensionFile1 = file1.name.split(".").pop();
    const extensionFile2 = file2.name.split(".").pop();

    document.getElementById("progress").style.display = "block";

    if (extensionFile1 !== format || extensionFile2 !== format) {
      document.getElementById("progress").style.display = "none";
      alert(
        "Os arquivos selecionados não correspondem ao formato especificado."
      );
      return;
    }

    try {
        const [data1, data2] = await Promise.all([
            FileReaderService.readFile(file1, format),
            FileReaderService.readFile(file2, format)
        ]);

        const worker = new Worker('worker.js', { type: 'module' });

        worker.postMessage({ data1, data2, column1, column2, batchSize });

        worker.onmessage = function(e) {
            const result = e.data;

            const resultCount = result.length;
            const resultCountDiv = document.getElementById('resultCount');
            resultCountDiv.textContent = `Total de resultados: ${resultCount}`;

            const resultList = document.getElementById('result');
            resultList.innerHTML = '';

            if (result.length === 0) {
                resultList.innerHTML = '<li class="list-group-item">Nenhum valor correspondente encontrado.</li>';
            } else {
                result.forEach(value => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item';
                    li.textContent = value;
                    resultList.appendChild(li);
                });
            }

            document.getElementById('progress').style.display = 'none';
        };
    } catch (error) {
        console.error('Erro ao ler os arquivos:', error);
        document.getElementById('progress').style.display = 'none';
        alert('Erro ao processar os arquivos.');
    }
});
