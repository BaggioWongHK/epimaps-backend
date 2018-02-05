<style>
img { width: 100px; height: 100px }
.wikipedia-logo { margin: auto; text-align: center }
</style>

<div class="wikipedia-logo">
    <img src="/images/wikipedia-logo.png" />
</div>

# CSS Documentation

Because there are many CSS selectors used to extract the structure
of a Wikipedia article's navbox's tree, it's important to record
what each selector does, or else it's very easy to get lost within
the DOM tree. 

In addition, the main methods used in epistemic maps rely on the
integrity of these CSS selectors to produce accurate results. If
there are pages whose structures do not follow the previously
scrutinized DOM trees, it's imperative to know what could 
contribute to breaking the methods. 

## Wikipedia's HTML structure

After looking at this,

````
if (childrenLiNodes.length === 0)
    childrenLiNodes = $(thNode).siblings('td').find("> * > * > tr > * > * > ul li");
````

I've reached the following conclusion. 

Unfortunately at this stage of the game, it would seem that Wikipedia's HTML structure is **NOT**
consistent. 

This means that the CSS selectors WILL break, and so the application backend will **never be completely
tested** if the CSS selector patterns are hard coded. (We've since solved this though - if we add another
loop to check upwards or downwards the DOM tree (depending on which direction we're traversing the tree), 
we can eliminate this problem.)

For instance, using the bottom up method, https://en.wikipedia.org/wiki/Federal_government_of_the_United_States
breaks - specifically, the United States articles portion of the DOM tree breaks specifically, 
because Geography and below titles have go **two levels deep** before reaching a ul list, **instead of
one level**. 

Fortunately, this is a project that's geared towards the front end - so as long as this is 
**MOSTLY correct** (and it is for most Wikipedia pages that have regularly nested HTML structures),
I'm going to **ignore the errors** caused by discrepancies in HTML structure. 

### Inconsistent issue resolution

A better method to parse navboxes would be to gather all the `th` and `li` nodes into two arrays,
and for each `li` node, check whether a `th` node is its direct parent, and build a tree bottom up.

For instance, you can check upwards every parent to see if it has a child `th` node, and stop when
the first `th` node is hit. Consider this: 

````html
<table>
    <tbody>
        <tr>
            <th>Ln heading</th>
            <td>
                <ul>...</ul>
            </td>
        </tr>
    </tbody>
</table>
````

And this: 

````html
<tr>
    <th>Ln heading</th>
</tr>
<tr>
    <table>
        <tbody>
            <tr>
                <td>
                    <ul>...</ul>
                </td>
            </tr>
        </tbody>
    </table> 
</tr>
````
 
However, doing so requires more checks than necessary, and while this guarantees complete correctness,
this can slow the entire program considerably if it hasn't already done so. Methods like `closest()`, 
`find()`, `siblings()`, `parents()` travel multiple levels in the DOM tree, and are **very expensive
operations**. 

So for now, I'm going to ignore erroneous results caused by forgoing this step, because I've deemed adding
this to incur an additional overhead to the current operations which are already quite costly.    

## CSS selectors used

Here's a list of CSS selectors used. 

- **Navbox** 

```javascript
$('.navbox-title abbr').closest('.navbox')
```

This is used to select one navbox. One example would be

China–Japan–South Korea trilateral summit leaders and foreign ministers
on https://en.wikipedia.org/wiki/China.

A few additional notes:

1. .navbox-title is an distinguishing feature of navboxes.
 
2. abbr represents the V·T·E links that belong only to the navboxes
we want. In other words, navboxes whose only function is to contain
other navboxes and have no containing links inside are discarded. 

***

- **Nested navboxes** 

```javascript
$('.navbox-title').closest('.navbox-subgroup')
```

These navboxes are nested within other navboxes, and must therefore
be handled separately. 

Nested navboxes have the distinguishing ```.navbox-subgroup``` class. 

***

- **Navbox title** 

```javascript
navBox.find('.navbox-title div[id]')
```

This allows us to extract the text wrapped inside this div. 

Originally, we went directly for the ```a``` link property, but
there's no guarantee that a navbox title would be linked, so this
is the safer way to describe the pattern. 

***

- **L1 `th` nodes** 

```javascript
$(thNode).closest('tr').siblings('tr').children('th')
```

We define three levels of `th` nodes: L0, L1 and Ln (n >= 2). 

As an example, on this page: https://en.wikipedia.org/wiki/China,

**L0**: Countries and dependencies of Asia

**L1**: Soverign states

**L2**: Australia

This pattern describes L1 `th`, as this corresponds to the DOM tree:

```html
<table>
    <tbody>
        <tr>
            <th>L0 heading</th>
        </tr>
        <tr>
            <th>L1 heading</th>
            <td>L1 content</th>
        </tr>
    </tbody>
</table>
```

***

- **Ln `th` nodes**

```javascript
$(thNode).siblings('td').find('> * > * > tr > th')
```

This describes Ln th nodes, but we've only found up to L2 th nodes
so far.

The DOM structure is as follows

```html
<th>L1</th>
<td>
    <table>
        <tbody>
            <tr>
                <th>Ln</th>
                <td>Ln content</th>
            </tr>
        </tbody>
    </table>
</td>
```

***

- **L1 content `li`** 

```javascript
$(thNode).closest('tr').siblings('tr').find('li')
```

Some L1 nodes don't necessarily have Ln sub th nodes.

In this case, all `li` content is extracted. 

The DOM tree is as follows:

````html
<tr>
    <th>L1 heading</th>
</tr>
<tr>
    <td>
        <div>
            <ul>
                <li>li content</li>
            </ul>        
        </div>
    </td>
</tr>
````

***

- **Ln content `li`**

````javascript
$(thNode).siblings('td').find("li")
````

This describes Ln level `li` content.

DOM tree: 

````html
<tr>
    <th>Ln header</th>
    <td>
        <div>
            <ul>
                <li>li content</li>
            </ul>
        </div>
    </td>
</tr> 
````