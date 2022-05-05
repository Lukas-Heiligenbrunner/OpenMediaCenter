package housekeeping

import "fmt"

func RunHouseKeepingTasks() {
	fmt.Println("Runnint houskeeping tasks!")

	fmt.Println("Deduplicating Tags")
	deduplicateTags()

	fmt.Println("Deduplicating Tags assigned to videos")
	deduplicateVideoTags()

	fmt.Println("Fix missing video metadata like ratio")
	fixMissingMetadata()

	fmt.Println("Finished housekeeping")
}
