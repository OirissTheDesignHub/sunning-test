// Sidebar open/close behavior for mobile
(function(){
	const menuBtn = document.getElementById('menuBtn');
	const sidebar = document.getElementById('mobileSidebar');
	const closeBtn = document.getElementById('closeBtn');
	const overlay = document.getElementById('sidebarOverlay');

	function openSidebar(){
		sidebar && sidebar.classList.add('open');
		overlay && overlay.classList.add('open');
		sidebar && sidebar.setAttribute('aria-hidden','false');
	}

	function closeSidebar(){
		sidebar && sidebar.classList.remove('open');
		overlay && overlay.classList.remove('open');
		sidebar && sidebar.setAttribute('aria-hidden','true');
	}

	menuBtn && menuBtn.addEventListener('click', openSidebar);
	menuBtn && menuBtn.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' ') openSidebar(); });
	closeBtn && closeBtn.addEventListener('click', closeSidebar);
	overlay && overlay.addEventListener('click', closeSidebar);

	document.addEventListener('keydown', (e) => {
		if(e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) closeSidebar();
	});
})();

/* function to redirect to contactus page */
function Tack_to_contac(){
    window.location="contact.html#calendar"
}

/* -------------------------- what we do ------------------------- */

const what_we_do=document.getElementById("what-we-do")

fetch('data/what_we_do.json')
.then(res=>res.json())
.then(data=>{
	data.forEach(item=>{
		let div = document.createElement("div")
		div.innerHTML=`
		<div class="what-we-do-flex">
			<img src="${item.img}" alt="${item.title}"/>
			<div class="what-desc">
				<h2 class="tc-o">${item.title}</h2>
				<p class="mt-10 ">${item.description}</p>
				<button class="btn mt-10 btn-transform">READ MORE</button>
			</div>
		</div>
		`

		// add click handler to READ MORE button to redirect with the item's id
		const readBtn = div.querySelector('button');
		const itemId = item.id ?? item.ide ?? item.slug ?? item.title ?? '';
		if(readBtn){
			readBtn.addEventListener('click', () => {
				if(itemId) {
					window.location = 'services.html?id=' + encodeURIComponent(itemId);
				} else {
					window.location = 'services.html';
				}
			});
			readBtn.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					readBtn.click();
				}
			});
		}

		what_we_do.appendChild(div)
	})
})


/* faq  in home page code  */
const faq_con=document.getElementById("faq_section")

function escapeHTML(str){
	return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

fetch("data/home-data.json")
.then(res=>res.json())
.then(data=>{
	if(!faq_con) return;
	faq_con.innerHTML = '';
	data.forEach((item, i) => {
		const wrapper = document.createElement('div');
		wrapper.className = 'mt-10';

		const qText = escapeHTML(item.question || item.questionText || '');
		const aText = escapeHTML(item.ans || item.answer || '');

		wrapper.innerHTML = `
			<div class="faq-question outer-box rd-m-h2" role="button" tabindex="0" id="faq-q-${i+1}" aria-expanded="false" aria-controls="faq-a-${i+1}">
				${qText} <span class="faq-plus" aria-hidden="true">+</span>
			</div>
			<div class="faq-answer mb bg-o tc-w" id="faq-a-${i+1}" aria-hidden="true" style="overflow:hidden;transition:max-height 0.25s ease;max-height:0px;">
				<p>${aText}</p>
			</div>
		`;

		faq_con.appendChild(wrapper);

		const btn = wrapper.querySelector('.faq-question');
		const panel = wrapper.querySelector('.faq-answer');

		// Toggle function: close others and open/close this
		btn.addEventListener('click', () => {
			const expanded = btn.getAttribute('aria-expanded') === 'true';

			// close other items (true accordion)
			document.querySelectorAll('.faq-question').forEach(q => {
				if (q !== btn) {
					q.setAttribute('aria-expanded', 'false');
					const aid = q.getAttribute('aria-controls');
					const other = document.getElementById(aid);
					if (other) {
						other.setAttribute('aria-hidden', 'true');
						other.style.maxHeight = '0px';
						other.parentElement && other.parentElement.classList.remove('open');
					}
				}
			});

			if (expanded) {
				btn.setAttribute('aria-expanded', 'false');
				panel.setAttribute('aria-hidden', 'true');
				// animate close
				panel.style.maxHeight = '0px';
				wrapper.classList.remove('open');
			} else {
				btn.setAttribute('aria-expanded', 'true');
				panel.setAttribute('aria-hidden', 'false');
				// animate open: add .open first so any padding from CSS is applied
				wrapper.classList.add('open');
				// force a reflow then set maxHeight based on computed scrollHeight
				const height = panel.scrollHeight;
				panel.style.maxHeight = height + 'px';
			}
		});

		// keyboard activation (Enter / Space)
		btn.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				btn.click();
			}
		});
	});
})
.catch(err => console.error('Failed to load FAQ data', err));


// Marquee section mapping for our_portfolio_images (with new CSS)
// Reviews rendering for About page
fetch('data/review.json')
	.then(res => res.json())
	.then(data => {
		const reviewsContainer = document.getElementById('reviews_section');
		if (!reviewsContainer || !Array.isArray(data)) return;
		reviewsContainer.innerHTML = '';
		data.forEach((item, i) => {
			const card = document.createElement('div');
			card.className = 'review-card mt-10';

			const name = escapeHTML(item.name || item.user || 'Anonymous');
			const rating = Number(item.rating) || 0;
			const comment = escapeHTML(item.comment || item.text || item.review || '');

			// build star icons (filled + outline)
			let stars = '';
			for (let s = 1; s <= 5; s++) {
				if (s <= rating) stars += '<i class="bi bi-star-fill tc-o" aria-hidden="true"></i>';
				else stars += '<i class="bi bi-star tc-b" aria-hidden="true"></i>';
			}

			card.innerHTML = `
				<div class="outer-box rd-m-h2 pd-20 bg-white review-card-inner">
					<div class="review-header">
						<h3 class="tc-o review-name">${name}</h3>
						<div class="rating">${stars}</div>
					</div>
					<p class="tc-b mt-10 review-comment">${comment}</p>
				</div>
			`;

			reviewsContainer.appendChild(card);
		});
	})
	.catch(err => console.error('Failed to load reviews', err));

/* --------------------------------- our port folio section -------------------------- */
window.addEventListener('DOMContentLoaded', function() {
    const marque_section = document.querySelector('.marque_section');
    if (marque_section && Array.isArray(our_portfolio_images)) {
        const marqueeWrapper = document.createElement('div');
        marqueeWrapper.className = 'marquee-wrapper';
        // Map images
        our_portfolio_images.forEach(item => {
            if (item && item !== "#") {
                const markq_img = document.createElement('div');
                markq_img.className = 'markq_img';
                const img = document.createElement('img');
                img.src = item;
                img.alt = 'portfolio';
                markq_img.appendChild(img);
                marqueeWrapper.appendChild(markq_img);
            }
        });
        // Duplicate for infinite effect
        our_portfolio_images.forEach(item => {
            if (item && item !== "#") {
                const markq_img = document.createElement('div');
                markq_img.className = 'markq_img';
                const img = document.createElement('img');
                img.src = item;
                img.alt = 'portfolio';
                markq_img.appendChild(img);
                marqueeWrapper.appendChild(markq_img);
            }
        });
        marque_section.innerHTML = '';
        marque_section.appendChild(marqueeWrapper);
    }
});
const our_portfolio_images=[
  "media/portfolio/portfolio1.jpg",
  "media/portfolio/portfolio2.jpg",
  "media/portfolio/portfolio3.jpg",
  "media/portfolio/portfolio4.jpg",
  "media/portfolio/portfolio5.jpg",
  "media/portfolio/portfolio6.jpg",
  "media/portfolio/portfolio7.jpg",
  "media/portfolio/portfolio8.jpg",
  "media/portfolio/portfolio9.jpg"
];
