/* 
		Several ways to use existing/3rd party JS libraries we need:

			---- Most preferred ----

			1:	* as Meteor package, published in the Atmosphere package directory.
						Benefits: Meteor packages can handle dependencies, load order
					
			2:	* an unpublished, local Meteor package we create in `/packages`, to 
						wrap a 3rd party JS lib. Ideally references the external lib 
						as a submodule. This Meteor package can also reference/depend on 1 or more 
					  existing npm package(s)
					
			3: 	* JS libs wrapped in module format AMD/Require/Common can usually safely 
				  	live here. Easy to get started without overhead. Hard to manage, as 
				  	Meteor's load order is not guaranteed

			4: 	* JS libs not wrapped in module format benefit from being in `client/compatibility`
						as Meteor expects these libs in that directory, for processing/loading

			---- Least preferred ----

		TODO: move all 3rd party libraries in this directory into out to individual, local Meteor packages

*/