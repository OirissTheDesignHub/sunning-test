const ser_con = document.getElementById('ser_con');

fetch('scripts/service-detail.json')
.then(res=>res.json())
.then(data=>{
    data.forEach(element => {
        let div = document.createElement("div")
        div.innerHTML = `
            <section class="service-flex">
                <img src="${element.img}" alt="${element.title}">
                <h1 style="width:300px">${element.title}</h1>
                <div style="width:500px">
                    <p class="tc-o">${element.h1}</p>
                    <p class="mt-10">${element.p}</p>
                    <button class="service-btn scale-up" data-id="${element.id}">${element.btn_txt}</button>
                <div>
            </section>
            <hr/>
        `
        div.classList.add('fade-up','padding')
        ser_con.appendChild(div)

        // attach click handler to open services.html with id in query string
        const btn = div.querySelector('button.service-btn');
        if(btn){
            btn.addEventListener('click', (e) => {
                const id = btn.dataset.id ?? element.id ?? '';
                const url = `services.html?id=${encodeURIComponent(id)}`;
                window.open(url, '_blank');
            });
        }
    });
})
