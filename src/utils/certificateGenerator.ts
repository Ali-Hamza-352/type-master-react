
export interface CertificateData {
  userName: string;
  courseName: string;
  completionDate: string;
  averageWPM: number;
  averageAccuracy: number;
}

export const generateCertificateHTML = (data: CertificateData): string => {
  const html = `
    <div style="width: 800px; height: 600px; padding: 20px; text-align: center; border: 10px solid #787878; position: relative; font-family: Arial, sans-serif;">
      <div style="width: 750px; height: 550px; padding: 20px; text-align: center; border: 5px solid #787878;">
        <span style="font-size: 50px; font-weight: bold; color: #3a86ff;">Certificate of Completion</span>
        <br><br>
        <span style="font-size: 25px;"><i>This is to certify that</i></span>
        <br><br>
        <span style="font-size: 30px;"><b>${data.userName}</b></span><br><br>
        <span style="font-size: 25px;"><i>has successfully completed the</i></span> <br><br>
        <span style="font-size: 30px;">${data.courseName}</span> <br><br>
        <span style="font-size: 20px;">with an average typing speed of <b>${data.averageWPM} WPM</b> and accuracy of <b>${data.averageAccuracy}%</b></span> <br><br><br>
        <span style="font-size: 25px;">${data.completionDate}</span><br>
        
        <div style="position: absolute; bottom: 50px; right: 50px; font-size: 18px; font-style: italic;">
          <div>Signature: </div>
          <div style="font-family: 'Brush Script MT', cursive; font-size: 30px; margin-top: 10px; color: #1a1a1a;">AH</div>
        </div>
      </div>
    </div>
  `;
  
  return html;
};

export const saveCertificateToLocalStorage = (data: CertificateData) => {
  const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
  certificates.push({
    ...data,
    id: `cert-${Date.now()}`,
    issueDate: new Date().toISOString()
  });
  localStorage.setItem('certificates', JSON.stringify(certificates));
};

export const downloadCertificate = (data: CertificateData) => {
  const html = generateCertificateHTML(data);
  
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (iframeDoc) {
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();
    
    setTimeout(() => {
      try {
        iframe.contentWindow?.print();
      } catch (error) {
        console.error('Failed to print certificate:', error);
      } finally {
        document.body.removeChild(iframe);
      }
    }, 500);
  }
};
