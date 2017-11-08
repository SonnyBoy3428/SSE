function getPage(redirectUrl) {
	$.ajax({
		url: '/index.html',
		method: 'get',
		data: { url: redirectUrl }
	})
}