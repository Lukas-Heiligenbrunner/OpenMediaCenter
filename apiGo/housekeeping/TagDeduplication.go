package housekeeping

import (
	"fmt"
	"openmediacenter/apiGo/database"
)

func deduplicateTags() {
	// find all duplicate tags

	// gives first occurence of duplicate
	query := `
SELECT
    tag_name
FROM
    tags
GROUP BY tag_name
HAVING COUNT(tag_name) > 1`
	rows := database.Query(query)
	duplicates := []string{}
	if rows != nil {
		for rows.Next() {
			var id string
			err := rows.Scan(&id)
			if err != nil {
				panic(err.Error()) // proper Error handling instead of panic in your app
			}
			duplicates = append(duplicates, id)
		}
	} else {
		// nothing to do
		return
	}

	fmt.Print("deleting duplicate tag ids: ")
	fmt.Println(duplicates)

	for _, el := range duplicates {
		query := fmt.Sprintf("SELECT tag_id FROM tags WHERE tag_name='%s'", el)
		rows := database.Query(query)
		ids := []uint32{}
		for rows.Next() {
			var id uint32
			err := rows.Scan(&id)
			if err != nil {
				panic(err.Error()) // proper Error handling instead of panic in your app
			}
			ids = append(ids, id)
		}

		// id to copy other data to
		mainid := ids[0]

		// ids to copy from
		copyids := ids[1:]

		fmt.Printf("Migrating %s\n", el)
		migrateTags(mainid, copyids)
	}
}

func migrateTags(destid uint32, sourcids []uint32) {
	querytempl := `
UPDATE video_tags 
SET 
    tag_id = %d
WHERE
    tag_id = %d`

	for _, id := range sourcids {
		err := database.Edit(fmt.Sprintf(querytempl, destid, id))
		if err != nil {
			fmt.Printf("failed to set id from %d to %d\n", id, destid)
			return
		}
		fmt.Printf("Merged %d into %d\n", id, destid)

		// now lets delete this tag
		query := fmt.Sprintf(`DELETE FROM tags WHERE tag_id=%d`, id)
		err = database.Edit(query)
		if err != nil {
			fmt.Printf("failed to delete Tag %d", id)
			return
		}
	}
}
