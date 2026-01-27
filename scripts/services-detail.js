(function(){
  // Read `id` param from the URL
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const main = document.getElementById('serviceMain');

  function showNotFound(){
    if(!main) return;
    main.innerHTML = `
      <section style="height:100vh;display:flex;align-items: center;justify-content: center;">
      <span>
        <h1 class="txt-c mt">Service not found</h1>
        <p class="txt-c">We couldn't find the service you're looking for.</p>
      </span>
      </section>
    `;
  }

  if(!id){
    showNotFound();
    return;
  }

  fetch('scripts/services-data.json')
    .then(res => res.json())
    .then(data => {
      const item = data.find(s => s.id === id);
      if(!item){ showNotFound(); return; }

      const approachHtml = (item.approach||[]).map(a => `\n        <li><strong>${a.title} - </strong><span>${a.description}</span></li>`).join('');
      const whyHtml = (item.whyChooseUs||[]).map(w => `\n        <li><strong>${w.title} - </strong><span>${w.description}</span></li>`).join('');

      main.innerHTML = `
        <section class="content" style="margin-top: 150px;">
          <img class="service-hero" src="${item.heroImage}" alt="${item.title}" loading="lazy" >
          <h1 class="txt-c mt-50 mb">${item.title}</h1>
          <h2 class="tc-o mb">what is ${item.title} ?</h2>
          <p class="l-height">${item.overview || ''}</p>
        </section>

        <section class="content">
          <h2 class="tc-o mb mt-50">Our Approach</h2>
          <ul class="l-height">${approachHtml}</ul>
        </section>

        <section class="content mt">
          <h2 class="tc-o mb mt-50">Why Choose Us for ${item.title}?</h2>
          <ul class="l-height">${whyHtml}</ul>
        </section>

        <button class="mt-50 mb btn1 scale-up" onclick=Tack_to_contac()>GET A FREE CONSULTATION</button>
      `;
    })
    .catch(err => {
      console.error(err);
      showNotFound();
    });
})();
