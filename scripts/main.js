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
	window.location = 'contact.html#calendar';
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
				<button class="btn mt-10 btn-transform" onclick=Tack_to_contac()>LEARN MORE</button>
			</div>
		</div>
		`

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

		// alternate styles: questions alternate background; answers invert background accordingly
		// For index 0 (1st), question: bg-o tc-w, answer: white + shadow
		// For index 1 (2nd), question: bg-white, answer: bg-o tc-w
		const isOdd = i % 2 === 0; // 0 -> first item
		const qClass = `faq-question outer-box rd-m-h2 ${isOdd ? 'bg-o tc-w' : 'bg-white'}`;
		const aClass = isOdd ? 'faq-answer mb faq-shadow' : 'faq-answer mb bg-o tc-w';

		wrapper.innerHTML = `
			<div class="${qClass}" role="button" tabindex="0" id="faq-q-${i+1}" aria-expanded="false" aria-controls="faq-a-${i+1}">
				${qText} <span class="faq-plus" aria-hidden="true">+</span>
			</div>
			<div class="${aClass}" id="faq-a-${i+1}" aria-hidden="true" style="overflow:hidden;transition:max-height 0.25s ease;max-height:0px;">
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

/* --------------------------------- fixed contact badge injection -------------------------- */
(function(){
	// Do not show on contact page
	if(window.location.href.includes('contact.html')) return;

	// Look for banner elements (home slider or banner section)
	const bannerEl = document.querySelector('.slider, .banner');

	// Create badge (image only)
	const badge = document.createElement('div');
	badge.className = 'fixed-badge';
	badge.innerHTML = `
		<img class="fixed-badge-img" src="media/icons/fixed_badge.svg" alt="Contact badge">
	`;
	document.body.appendChild(badge);

	// Create modal overlay (hidden by default)
	const modalOverlay = document.createElement('div');
	modalOverlay.className = 'fixed-badge-modal-overlay';
	modalOverlay.innerHTML = `
		<div class="fixed-badge-modal" role="dialog" aria-modal="true">
			<div class="popup-top"></div>
			<img src="media/icons/Pop-up.svg" alt="Contact popup">
			<div class="popup-bottom">
				<button class="popup-action btn">Contact us</button>
			</div>
		</div>
	`;
	document.body.appendChild(modalOverlay);

	const badgeImg = badge.querySelector('.fixed-badge-img');

	function openModal(){
		modalOverlay.classList.add('open');
		// prevent background scroll
		document.documentElement.style.overflow = 'hidden';
		document.body.style.overflow = 'hidden';
	}

	function closeModal(){
		modalOverlay.classList.remove('open');
		document.documentElement.style.overflow = '';
		document.body.style.overflow = '';
	}

	// open modal when clicking the fixed badge image
	badgeImg && badgeImg.addEventListener('click', (e) => {
		e.stopPropagation();
		openModal();
	});

	// close when clicking overlay (but not the modal content)
	modalOverlay.addEventListener('click', (e) => {
		if (e.target === modalOverlay) closeModal();
	});

	// close on ESC
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
	});

	// wire up popup action button: close modal and go to contact calendar
	const popupAction = modalOverlay.querySelector('.popup-action');
	if(popupAction){
		popupAction.addEventListener('click', () => {
			closeModal();
			window.location = 'contact.html#calendar';
		});
	}

	function updateBadge(){
		if(!bannerEl){
			// If no banner on page, show badge
			badge.classList.add('show');
			return;
		}
		const rect = bannerEl.getBoundingClientRect();
		// Show badge when banner has scrolled completely out of view
		if(rect.bottom <= 0){
			badge.classList.add('show');
		} else {
			badge.classList.remove('show');
		}
	}

	// Listen for scroll/resize to toggle badge
	window.addEventListener('scroll', updateBadge, { passive: true });
	window.addEventListener('resize', updateBadge);
	// Initial check
	updateBadge();
})();
