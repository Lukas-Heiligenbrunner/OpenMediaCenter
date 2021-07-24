package api

func AddPhotoHandlers() {
	/**
	 * @api {post} /api/photos [getPhotos]
	 * @apiDescription get all available pictures
	 * @apiName getPhotos
	 * @apiGroup Photos
	 *
	 * @apiSuccess {string} result 'success' if successfully or error message if not
	 */
	AddHandler("getPhotos", PhotoNode, func(info *HandlerInfo) []byte {
		return nil
	})
}
