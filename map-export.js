(function () {
  const exportButtons = document.querySelectorAll('a[data-export-target]');
  if (!exportButtons.length) return;

  const exportMapToPdf = async (targetSelector, filename) => {
    const mapEl = document.querySelector(targetSelector);
    if (!mapEl || !window.html2canvas || !window.jspdf || !window.jspdf.jsPDF) {
      throw new Error('Export dependencies unavailable.');
    }

    const canvas = await window.html2canvas(mapEl, {
      backgroundColor: '#f4f1e8',
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    const img = canvas.toDataURL('image/png');
    const orientation = canvas.width >= canvas.height ? 'landscape' : 'portrait';
    const pdf = new window.jspdf.jsPDF({
      orientation,
      unit: 'pt',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(img, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(filename || 'map-export.pdf');
  };

  exportButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const target = btn.getAttribute('data-export-target');
      const filename = btn.getAttribute('data-export-filename') || 'map-export.pdf';

      if (!target) return;

      e.preventDefault();
      try {
        await exportMapToPdf(target, filename);
      } catch (err) {
        // Fallback to direct file download if export fails for any reason.
        const href = btn.getAttribute('href');
        if (href) window.location.href = href;
      }
    });
  });
})();
