const axios = require('axios');

async function test(){

    const options = {
    method: 'GET',
    url: 'https://tiktok-download-video-no-watermark.p.rapidapi.com/tiktok/info',
    params: {
        url: 'https://vt.tiktok.com/ZGJBQHoHA/'
    },
    headers: {
        'X-RapidAPI-Key': '6455aaea0emshd81dc28a915e393p1d5269jsn59fc1e9bdbbe',
        'X-RapidAPI-Host': 'tiktok-download-video-no-watermark.p.rapidapi.com'
    }
    };

    try {
        const response = await axios.request(options);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}
test();