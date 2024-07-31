export class Renderer {
  constructor(resultList) {
      this.resultList = resultList;
  }

  displayResults(results) {
    const resultCount = results.length;
    const resultCountDiv = document.getElementById('resultCount');
    resultCountDiv.textContent = `Total de resultados: ${resultCount}`;

      this.resultList.innerHTML = '';
      const batchSize = 100;
      let start = 0;

      const renderBatch = () => {
          const batch = results.slice(start, start + batchSize);
          batch.forEach(result => {
              const li = document.createElement('li');
              li.textContent = result;
              li.className = 'list-group-item';
              this.resultList.appendChild(li);
          });
          start += batchSize;
          if (start < results.length) {
              requestAnimationFrame(renderBatch);
          }
      };

      const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  observer.disconnect();
                  renderBatch();
              }
          });
      });

      observer.observe(this.resultList);
  }
}
