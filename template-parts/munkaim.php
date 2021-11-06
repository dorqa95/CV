<section id="munkaim" class="portfolio section-bg">
    <div class="container">
        
        <div class="section-title">
            <h2>Munkáim</h2>
            <p>
				Íme néhány oldal, ahol a munkámmal találkozhattatok már:
			</p>
        </div>
        
        <div class="row" data-aos="fade-up">
            <div class="col-lg-12 d-flex justify-content-center">
                <ul id="portfolio-filters">
                    <li data-filter="*" class="filter-active">Mind</li>
                    <li data-filter=".filter-bank">Bankok</li>
                    <li data-filter=".filter-web">Szolgáltatások</li>
                    <li data-filter=".filter-game">Nyereményjátékok</li>
                </ul>
            </div>
        </div>
        
        <div class="row portfolio-container" data-aos="fade-up" data-aos-delay="100">
			<?php $webpages = [
				['bank', 'Magyar Nemzeti Bank', 'https://mnb.hu'],
				['web', '4iG', 'https://4ig.hu'],
				['bank', 'OTP Merkantil Bank', 'https://merkantil.hu'],
				['web', 'Akváriumklub', 'https://akvariumklub.hu'],
				['game', 'Momentsostya nyereményjáték', 'https://www.momentsostya.hu/nyeremenyjatek'],
				['game', 'Andante family nyereményjáték', 'https://andantefamily.hu/nyeremenyjatek'],
				['web', 'DSE röplabda', 'https://dseroplabda.hu'],
				['web', 'Futureal', 'https://www.futurealgroup.com/hu'],
				['game', 'Rauch nyereményjáték', 'https://rauchjatek.hu'],
				['web', 'TelekomTV', 'https://telekomtvgo.hu'],
				['web', 'Magyar Posta', 'https://posta.hu'],
				['web', 'K&H POS', 'https://khpos.hu'],
			];
			foreach ($webpages as $i => $webpage):
			?>
				<div class="col-lg-2 col-md-6 portfolio-item filter-<?= $webpage[0] ?>">
					<div class="portfolio-wrap">
						<a href="/assets/img/portfolio/portfolio-<?= $i+1; ?>.png" data-gallery="portfolioGallery" class="portfolio-lightbox" title="<?= $webpage[1] ?>">
							<img src="/assets/img/portfolio/portfolio-<?= $i+1; ?>.png" class="img-fluid" alt="">
						</a>
						<div class="portfolio-links">
							<a href="<?= $webpage[2]; ?>" target="_blank" title="Tovább"><i class="bx bx-link"></i></a>
						</div>
					</div>
					
					<!--div class="portfolio-wrap">
						<img src="/assets/img/portfolio/portfolio-<?= $i+1; ?>.png" class="img-fluid" alt="">
						<div class="portfolio-links">
							<a href="/assets/img/portfolio/portfolio-<?= $i+1; ?>.png" data-gallery="portfolioGallery"
							   class="portfolio-lightbox" title="<?= $webpage[1] ?>"><i class="bx bx-plus"></i></a>
							<a href="<?= $webpage[2]; ?>" title="Tovább"><i class="bx bx-link"></i></a>
						</div>
					</div-->
				</div>
			<?php endforeach; ?>
        </div>
    </div>
</section>