package api

import "openmediacenter/apiGo/database"

func AddTagHandlers() {
	getFromDB()
	addToDB()
	deleteFromDB()
}

func deleteFromDB() {

}

func getFromDB() {
	AddHandler("getAllTags", TagNode, nil, func() []byte {
		query := "SELECT tag_id,tag_name from tags"
		return jsonify(readTagsFromResultset(database.Query(query)))
	})
}

func addToDB() {
	var ct struct {
		TagName string
	}
	AddHandler("createTag", TagNode, &ct, func() []byte {
		query := "INSERT IGNORE INTO tags (tag_name) VALUES (?)"
		return database.SuccessQuery(query, ct.TagName)
	})
}
