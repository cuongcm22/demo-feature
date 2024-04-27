const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

// Tên file Excel ban đầu và file mới cần tạo
// const inputFile = 'headerXlsxFile.xlsx';
// const outputFile = 'newfile.xlsx';

const pathFolderWorking = '/assets/public/csv'

async function exportHeaderLayout(inputFile, outputFile) {
    console.log('exportHeaderLayout run 1');
    // inputfile = '/assets/public/csv'/layout/headerXlsxFile.xlsx
    // output file = /assets/public/csv/export/[nametable]-YYYYMMDDTHHmmss.xlsx

    

    const workbook = new ExcelJS.Workbook();
    
    // Đọc file Excel ban đầu
    workbook.xlsx.readFile(inputFile)
        .then(() => {
            // Lấy sheet đầu tiên
            const worksheet = workbook.getWorksheet(1);
    
            // Lưu header và định dạng của nó
            const headerRow = worksheet.getRow(1);
            
            const rowI = worksheet.getRow(2);
            
    
            // Copy định dạng và text từ header sang rowI
            headerRow.eachCell((cell, colNumber) => {
                const cellI = rowI.getCell(colNumber);
                cellI.value = cell.value;
                cellI.style = Object.assign({}, cell.style);
            });
    
            // Lưu vào file mới
            return workbook.xlsx.writeFile(outputFile);
        })
        .then(() => {
            console.log(`Đã lưu thành công vào ${outputFile}`);
            return;
        })
        .catch((error) => {
            console.error('Đã xảy ra lỗi:', error);
            return;
        });

}


async function exportDataToXlsxFile(myData, inputFile) {
    console.log('exportDataToXlsxFile run 2');
    // myData = [tensp,masp,soluong,dongia,v.v]
    // inputFile cần chèn và sao lưu lại
    // inputFile = /assets/public/csv/export/[nametable]-YYYYMMDDTHHmmss.xlsx

    const workbook = new ExcelJS.Workbook();
    const headerRow = ['idRecord', 'device', 'borrower', 'borrowedAt', 'expectedReturnDate', 'actualReturnDate', 'transactionStatus', 'proofImageUrl', 'proofVideoUrl'];

    workbook.xlsx.readFile(inputFile)
        .then(() => {
            const worksheet = workbook.getWorksheet(1);

            // Add header
            worksheet.addRow(headerRow);

            // Thêm dữ liệu từ mảng myData vào file Excel
            myData.forEach(data => {
                // const { tenSanPham, maSanPham, soLuong, donGia, tongTien } = data;
                const { idRecord, device, borrower, borrowedAt, expectedReturnDate, actualReturnDate, transactionStatus } = data;
                worksheet.addRow([idRecord, device, borrower, borrowedAt, expectedReturnDate, actualReturnDate, transactionStatus]);
            });

            // Lưu file Excel
            return workbook.xlsx.writeFile(inputFile);
        })
        .then(() => {
            console.log('Dữ liệu đã được thêm vào file Excel thành công.');
    
            // // Chèn thêm 7 hàng phía trên dữ liệu đã chèn
            // const worksheet = workbook.getWorksheet(1);
            // // const dataToInsert = [
            // //     ['New Data 1', 'ND001', 1, 1000, 1000],
            // //     ['New Data 2', 'ND002', 2, 2000, 4000],
            // //     ['New Data 3', 'ND003', 3, 3000, 9000],
            // //     ['New Data 4', 'ND004', 4, 4000, 16000],
            // //     ['New Data 5', 'ND005', 5, 5000, 25000],
            // //     ['New Data 6', 'ND006', 6, 6000, 36000],
            // //     ['New Data 7', 'ND007', 7, 7000, 49000]
            // // ];
            // const dataToInsert = [
            //     [''],
            //     [''],
            //     [''],
            //     [''],
            //     [''],
            //     [''],
            //     ['']
            // ];
    
            // // Chèn từng hàng dữ liệu vào trước dòng đầu tiên của dữ liệu đã chèn
            // for (let i = 0; i < dataToInsert.length; i++) {
            //     worksheet.spliceRows(2, 0, dataToInsert[i]);
            // }
    
            // // Lưu file Excel sau khi chèn dữ liệu mới
            return workbook.xlsx.writeFile(inputFile);
        })
        .then(() => {
            console.log('Dữ liệu mới đã được chèn vào file Excel thành công.');
        })
        .catch(err => {
            console.error('Đã xảy ra lỗi:', err);
        });
}


module.exports = {
    exportHeaderLayout,
    exportDataToXlsxFile
}