window.onload = () => {

	let [prev_page, now_page] = ['home', 'home'];
	let work = 0;
	const [min_work, max_work] = [0, 4];
	const [$wrap, $content] = [$('.wrap'), $('.content')];

	/* 초기화 */
	const init = () => {
		$wrap.removeClass('on work about home');
	}

	/* 메인 애니메이션 */
	const action_home = () => {
		const text = new TypeIt("#my_text", {
			speed:50,
			waitUntilVisible: true,
		}).type("이정석, 4년차", {delay:500}).move(-2).delete(1).type(3).move('end').type(' 음악을 좋아하는').pause(300).type(' 감성 가득 퍼블리셔!')
			.go();
	}

	/* 포트폴리오 작업 리스트 */
	const getWork = (work) => {

		$.ajax({
			url: `https://rheejeongseok.github.io/rhee_portfolio/work_list.json`,
			// url: `${window.location.origin}/work_list.json`,
			type: 'GET',
			dataType: 'JSON',
			success: (data) => {
				console.log(JSON.stringify(data))
				console.log(data)
				const [$d_bg, $d_title, $d_img_list] = [$('.work_list .bg'), $('.work_list .title'), $('.work_list .img_list')];
				const [$v_work_img, $v_skills, $v_title_en, $v_title_kr, $v_link, $v_con_text, $v_img] = [$('.work_img'), $('.skills'), $('.title_en'), $('.title_kr'), $('.link'), $('.con_text'), $('.img_wrap')]
				const {title_en, title_kr, background, link, skill, text, work_date, list_img, view_img} = data[work];
				
				$d_bg.css('background', background);
				$d_title.html(`<p>${title_en}</p>`);
				$v_skills.text(skill);
				$v_title_en.text(title_en);
				$v_title_kr.text(title_kr);
				$v_link.attr('href', `javascript:window.open("${link}")`);
				// $v_link.attr('href', link);
				$v_con_text.text(text);
				$v_con_text.append(`<div class="work_date">프로젝트 기간 : ${work_date}</div>`)

				const list_img_html = list_img.map(e => {
					return `
                  <div class="${e}">
                     <img src="./images/${e}.png" alt="${title_kr} 리스트 이미지" />
                  </div>
               `
				});

				$d_img_list.html(list_img_html.join(''));
				$v_work_img.html(list_img_html.join(''));

				const view_img_html = view_img.map(e => {
					return `
                  <img src="./images/${e}.png" alt="${title_kr} 상세 이미지" />
               `
				});

				$v_img.html(view_img_html.join(''))
			}
		})
	}

	/* 페이지 세팅 */
	const setPage = (url) => {
		
		$.ajax({
			url: `https://rheejeongseok.github.io/rhee_portfolio/html/${url}.html`,
			// url: `${window.location.origin}/html/${url}.html`,
			dataType: 'html',
			beforeSend: () => {
				init();
				if (url === 'home') $content.fadeOut(500);
				else $content.fadeOut(500);

			},
			success: (data) => {
				setTimeout(() => {
					$wrap.addClass(url)
					$content.html(data);
					if (url === 'work') getWork(0);
					if (url === 'about') $wrap.addClass('on');
					history.pushState({url:url, data:data}, '', url);

					if (url === 'about') $content.show().addClass('about_ani');
					else if (url === 'work') $content.show().addClass('work_ani');
					else $content.fadeIn(1000);
				}, 1000)
			},
			complete: () => {
				setTimeout(() => {
					$content.removeClass('about_ani work_ani')
					if (url === 'home') action_home();
					
				}, 2000)
			}
		});
	}

	/* 포트폴리오 리스트 버튼 */
	$wrap.on('click', '.btns a', e => {

		const $now = $('.work_num .now');
		const type = e.target.getAttribute('class');
		type === "prev" ? (work <= min_work ? work = max_work : work = work - 1) : (work >= max_work ? work = min_work : work = work + 1)
		if($wrap.has('.on')) $('html,body').scrollTop(0);
		$now.text(`0${work+1}`)
		getWork(work)

	});

	/* 포트폴리오 클릭 */
	$wrap.on('click', '.work_list ul', e => {

		const [$wl, $img_list, $work_num, $work_view] = [$('.work_list'), $('.img_list'), $('.work_num'), $('.work_view')];

		const [left, top, height, width] = [$wl.position().left, $wl.position().top, $wl.height(), $wl.width()];

		now_page === 'work' && $('.wrap').addClass('on')

		$img_list.fadeOut(500);
		$work_num.hide();
		$wl.css({
				'position': 'absolute',
				"left": left,
				"top": top,
				"height": height,
				'width': width
			})
			.animate({
				'left': 0,
				'top': 0,
				'height': '200px',
				'width': '100%'
			}, 1500, () => {
				$work_view.fadeIn(1000);
			})

	});

	/* $wrap.on('click','.site_info .link',(e) => {
		const url = e.target.dataset['url'];
		window.location.href=url;
	}) */

	/* 카테고리 클릭 */
	$('.menu a[data-url]').click(e => {
		e.preventDefault();
		const url = e.target.dataset['url'];
		prev_page = now_page;
		now_page = url;
		setPage(now_page, prev_page, now_page);
	});

	/* 스크롤 맨위 */
	$wrap.on('click','.scr_top',() => {
		$('html, body').stop().animate({scrollTop:0}, 1000, 'swing')
	})

	/* 뒤로 가기 시 페이지 세팅 */
	$(window).on('popstate', function (e) {
		const {url} = e.originalEvent.state
		setPage(url)
	})

	/* 처음 로딩화면 세팅 */
	$.ajax({
		url: 'index.html',
		success: () => {
			$('.intro .rhee').addClass('on');
			setTimeout(() => {
				$('.intro').fadeOut(1000);
				setPage(now_page);
			}, 2000)
		},		
	})

}