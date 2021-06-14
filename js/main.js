window.onload = () => {

	console.log("aaaa")

	let [prev_page, now_page] = ['home', 'home'];
	let work = 0;
	const [min_work, max_work] = [0, 4];
	const [$wrap, $content] = [$('.wrap'), $('.content')];

	const init = () => {
		$wrap.removeClass('on');
	}

	const action_home = () => {
		const text = new TypeIt("#txt_name", {
			strings: ["이정석"],
			waitUntilVisible: true,
			afterComplete: () => {
				const instance = new TypeIt('#txt_age', {
					strings: ["Look, it's rainbow text!"],
					waitUntilVisible: true,
					afterComplete: () => {
						const instance = new TypeIt('#txt_my', {
							strings: ["Look, it's rainbow text!"],
							waitUntilVisible: true,
						}).go();
					}
				}).go();
			}
		}).go();
	}

	const getWork = (work) => {

		$.ajax({
			url: `${window.location.origin}/work_list.json`,
			type: 'GET',
			dataType: 'JSON',
			success: (data) => {

				const [$d_bg, $d_title, $d_img_list] = [$('.work_list .bg'), $('.work_list .title'), $('.work_list .img_list')];
				const [$v_work_img, $v_skills, $v_title_en, $v_title_kr, $v_link, $v_con_text, $v_img] = [$('.work_img'), $('.skills'), $('.title_en'), $('.title_kr'), $('.link'), $('.con_text'), $('.img_wrap')]
				const {title_en, title_kr, background, link, skill, text, list_img, view_img} = data[work];

				$d_bg.css('background', background);
				$d_title.text(title_en);
				$v_skills.text(skill);
				$v_title_en.text(title_en);
				$v_title_kr.text(title_kr);
				$v_link.attr('href', link);
				$v_con_text.text(text);

				const list_img_html = list_img.map(e => {
					return `
                  <div class="${e}">
                     <img src="./images/${e}.png" alt="" />
                  </div>
               `
				});

				$d_img_list.html(list_img_html.join(''));
				$v_work_img.html(list_img_html.join(''));

				const view_img_html = view_img.map(e => {
					return `
                  <img src="./images/${e}.png" alt="" />
               `
				});

				$v_img.html(view_img_html.join(''))
			}
		})
	}

	const setPage = (url, prev, now) => {
		
		$.ajax({
			url: `${window.location.origin}/html/${url}.html`,
			dataType: 'html',
			beforeSend: () => {
				init();
				if (url === 'home') $content.fadeOut(500);
				else $content.fadeOut(500);

			},
			success: (data) => {
				setTimeout(() => {
					$content.html(data);
					if (url === 'work') getWork(0);
					if (url === 'about') $wrap.addClass('on');
					history.pushState({url:url, data:data}, '', url);
					if (url === 'about') $content.show().addClass('about');
					else if (url === 'work') $content.show().addClass('work');
					else $content.fadeIn(1000);

				}, 1000)
			},
			complete: () => {
				setTimeout(() => {
					$content.removeClass('fade-in-right scale-in-ver-center')
					if (url === 'home') action_home();
					
				}, 2000)

			}
		});
	}



	$wrap.on('click', '.btns a', e => {

		const type = e.target.getAttribute('class');
		type === "prev" ? (work <= min_work ? work = min_work : work = work - 1) : (work >= max_work ? work = max_work : work = work + 1)

		getWork(work)

	});

	$wrap.on('click', '.work_list ul', e => {

		const [$wl, $img_list, $work_view] = [$('.work_list'), $('.img_list'), $('.work_view')];

		const [left, top, height, width] = [$wl.position().left, $wl.position().top, $wl.height(), $wl.width()];

		now_page === 'work' && $('.wrap').addClass('on')

		$img_list.fadeOut(500);
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

	})

	$('.menu a').click(e => {
		e.preventDefault();
		const url = e.target.dataset['url'];

		prev_page = now_page;
		now_page = url;
		console.log(prev_page, now_page)
		setPage(now_page, prev_page, now_page)

	});

	/* window.onpopstate = (e) => {
      setPage(prev_page);
			console.log(e)
			console.log(e.originalEvent)
			console.log(window.location.hash)
   } */

	$(window).on('popstate', function (e) {
		const {url} = e.originalEvent.state
		setPage(url)
	})

	$.ajax({
		url: 'index.html',
		beforeSend: () => {
			console.log('before')
		},
		success: () => {
			console.log("suc")
			$('.intro .rhee').addClass('on');
			setTimeout(() => {
				$('.intro').fadeOut(1000);
				setPage('home');
			}, 2000)
		},
		complete: () => {
			console.log("complete")
		}
	})

}