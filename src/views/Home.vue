<template>
	<div class="home">
		<HelloWorld msg="欢迎使用酒店预定平台"/>
	</div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
	name: 'Home',
	components: {
		HelloWorld
	}
}
</script>
