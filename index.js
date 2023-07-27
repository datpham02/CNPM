const axios = require('axios')
const { parse } = require('node-html-parser')
const http = require('https')
const fs = require('fs')


const baseUrl = 'https://www.w3schools.com/xml/'
const url = 'https://www.w3schools.com/xml/xquery_example.asp'

const downFile = async (folder, fileName, url) => {

    //Tạo folder nếu folder chưa có
    fs.mkdir(`${__dirname}/${folder}`, { recursive: true }, (err) => {
        if (err) {
            console.error('Lỗi khi tạo thư mục:', err)
        } else {
            console.log('Thư mục đã được tạo thành công')
        }
    })


    //Tạo luồng ghi file
    const file = fs.createWriteStream(`${__dirname}/${folder}/${fileName}`)

    //Thực hiện tải file
        const request = http.get(url, (response) => {
            //Đọc dữ liệu từ  dữ liệu trả về và ghi file vào luồng ghi đã được khởi tạo
            response.pipe(file)

            // Tải thành công
            file.on('Finish', () => {
                file.close()
                console.log('Tải thành công')
            })

            //Tải thất bại (xảy ra lỗi khi tải file)
            file.on('error', (error) => {
                file.close()
                console.log('Tải thất bại : ', error)
            })
        })

}


// Hàm thực hiện xử lý page website và truy vấn tìm kiếm những file có đuôi xml trong page
const handleUrl = async (url) => {
    const respone = await axios.get(url)
    const parserData = parse(respone.data)
    const query = parserData.querySelector('#main').querySelectorAll('a')
    Promise.allSettled(
        query
            .filter((item) => item.getAttribute('href')?.includes('.xml'))
            .map((item) =>
                downFile(
                    'xml',
                    item.getAttribute('href'),
                    `${baseUrl}${item.getAttribute('href')}`,
                ),
            ),
    )
}
8
handleUrl(url)
