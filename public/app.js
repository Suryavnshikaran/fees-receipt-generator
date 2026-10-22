document.getElementById('feeForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
        studentName: document.getElementById('studentName').value,
        rollNo: document.getElementById('rollNo').value,
        course: document.getElementById('course').value,
        semester: document.getElementById('semester').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        tuitionFee: document.getElementById('tuitionFee').value,
        examFee: document.getElementById('examFee').value,
        transportFee: document.getElementById('transportFee').value,
        lateFee: document.getElementById('lateFee').value,
        amountPaid: document.getElementById('amountPaid').value,
    };

    try {
        const response = await fetch('/api/generate-receipt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            displayReceipt(result.receipt);
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Server connection failed!');
    }
});

function displayReceipt(data) {
    document.getElementById('receiptPlaceholder').classList.add('hidden');
    document.getElementById('receiptBox').classList.remove('hidden');

    document.getElementById('rNo').innerText = data.receiptNo;
    document.getElementById('rDate').innerText = data.date;
    document.getElementById('rName').innerText = data.studentName;
    document.getElementById('rRoll').innerText = data.rollNo;
    document.getElementById('rCourseSem').innerText = `${data.course} (${data.semester})`;
    document.getElementById('rMode').innerText = data.paymentMethod;

    document.getElementById('rTuition').innerText = '₹' + data.feesBreakdown.tuitionFee;
    document.getElementById('rExam').innerText = '₹' + data.feesBreakdown.examFee;
    document.getElementById('rTransport').innerText = '₹' + data.feesBreakdown.transportFee;
    document.getElementById('rLate').innerText = '₹' + data.feesBreakdown.lateFee;

    document.getElementById('rTotal').innerText = '₹' + data.totalAmount;
    document.getElementById('rPaid').innerText = '₹' + data.amountPaid;
    document.getElementById('rBalance').innerText = '₹' + data.balanceDue;

    const statusBadge = document.getElementById('rStatus');
    statusBadge.innerText = data.status;
    if (data.status === 'PAID') {
        statusBadge.style.backgroundColor = '#28a745';
    } else {
        statusBadge.style.backgroundColor = '#dc3545';
    }
}

// Download PDF Function (Directly attached)
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'downloadPdfBtn') {
        const element = document.getElementById('receiptContent');
        
        const opt = {
            padding: 9,
            margin:[5, 5, 5, 5],
            filename:     'Fee_Receipt_' + document.getElementById('rRoll').innerText + '.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 3, 
                useCORS: true, 
                scrollY: 0,
                windowWidth: element.scrollWidth 
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        html2pdf().set(opt).from(element).save();
    }
});

// Print Function
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'printBtn') {
        window.print();
    }
});