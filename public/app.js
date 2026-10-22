let cachedReceiptData = null;

// Step 1: Form Submit Handler (Proceed to Pay / Show QR or Cash Direct)
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            cachedReceiptData = result.receipt;

            document.getElementById('placeholderText').classList.add('hidden');

            // Check Payment Method
            if (formData.paymentMethod === 'UPI/QR') {
                // Show QR section side-by-side
                document.getElementById('displayPayableAmt').innerText = '₹' + result.receipt.totalAmount;
                document.getElementById('qrSection').classList.remove('hidden');
                document.getElementById('receiptBox').classList.add('hidden');
            } else {
                // If Cash, directly display receipt skipping QR
                document.getElementById('qrSection').classList.add('hidden');
                renderReceipt(result.receipt);
            }
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Server connection failed!');
    }
});

// Step 3: Generate Receipt Button Click (Inside QR Section)
document.getElementById('generateReceiptBtn').addEventListener('click', function () {
    if (cachedReceiptData) {
        // Hide QR section and render final receipt
        document.getElementById('qrSection').classList.add('hidden');
        renderReceipt(cachedReceiptData);
    }
});

// Function to populate receipt fields
function renderReceipt(data) {
    document.getElementById('rNo').innerText = data.receiptNo;
    document.getElementById('rDate').innerText = data.date;
    document.getElementById('rName').innerText = data.studentName;
    document.getElementById('rRoll').innerText = data.rollNo;
    document.getElementById('rCourse').innerText = data.course;
    document.getElementById('rSem').innerText = data.semester;
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
        statusBadge.style.backgroundColor = '#e67e22';
    }

    document.getElementById('receiptBox').classList.remove('hidden');
}

// Step 4: Download PDF Handler
document.getElementById('downloadPdfBtn').addEventListener('click', function () {
    const element = document.getElementById('receiptContent');
    const opt = {
        margin:(5, 5, 5, 5),
        padding:10,
        filename:     'Vikrant_University_Fee_Receipt_' + document.getElementById('rRoll').innerText + '.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, scrollY: 0, windowWidth: element.scrollWidth },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
});

// Reset Form Button
document.getElementById('resetBtn').addEventListener('click', function () {
    document.getElementById('feeForm').reset();
    document.getElementById('receiptBox').classList.add('hidden');
    document.getElementById('placeholderText').classList.remove('hidden');
});