package housekeeping

import (
	"fmt"
	"openmediacenter/apiGo/database"
)

func deduplicateVideoTags() {
	// gives first occurence of duplicate
	query := `
SELECT
    tag_id, video_id, count(tag_id)
FROM
    video_tags
GROUP BY tag_id, video_id
HAVING COUNT(tag_id) > 1`
	rows := database.Query(query)
	if rows != nil {
		for rows.Next() {
			var tagid uint32
			var vidid uint32
			var nr uint32
			err := rows.Scan(&tagid, &vidid, &nr)
			if err != nil {
				panic(err.Error()) // proper Error handling instead of panic in your app
			}

			// now lets delete this tag
			query := fmt.Sprintf(`DELETE FROM video_tags WHERE tag_id=%d AND video_id=%d LIMIT %d`, tagid, vidid, nr-1)
			err = database.Edit(query)
			if err != nil {
				fmt.Printf("failed to delete Tag %d + vid %d", tagid, vidid)
				return
			}
		}
	}
}
