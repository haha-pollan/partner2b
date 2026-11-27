-- Publish: Partner program tiers in 2026: how many and what to name them
-- Run once in the Supabase SQL editor. Re-running replaces the article with the same slug.
begin;
delete from articles where slug = 'partner-program-tiers-how-many-and-what-to-name-them';
insert into articles (slug, title, published_at, description, content_html, published)
values (
  'partner-program-tiers-how-many-and-what-to-name-them',
  'Partner program tiers in 2026: how many and what to name them',
  '2026-11-27',
  'Three tiers is the most common setup (42% of 860 programs). Most name partners by role, not level. How many tiers to use and what to call them.',
  $article$<p><strong>TL;DR</strong> Three tiers is the most common setup: <mark>42%</mark> of the <mark>860</mark> partner programs we compared list three, and <mark>59%</mark> list three or four. Most programs sort partners by role (<mark class="nm">Technology</mark>, <mark class="nm">Referral</mark>, <mark class="nm">Reseller</mark>), not by level (<mark class="nm">Silver</mark>, <mark class="nm">Gold</mark>, <mark class="nm">Platinum</mark>). Of the programs that name tiers, <mark>77%</mark> use role names only and <mark>8%</mark> use level names only. Programs with level names publish their commission more often: <mark>62%</mark>, against <mark>45%</mark> for role names only. If you are building a program, start with the roles you need, add two or three levels only when partners have something to earn by moving up, and give every tier its own benefit.</p>
<p class="byline">By Elena Zap, founder of Partner2B. Published 27 November 2026.</p>
<blockquote><p>A <a href="/glossary/partner-tiers">partner program tier</a> is a defined group inside a partner program, with its own requirements and benefits. Tiers come in two kinds. Levels rank partners by results (Silver, Gold, Platinum). Tracks, also called partner types, group partners by what they do (Technology, Referral, Reseller).</p></blockquote>
<p>We looked at the public program pages of <mark>860</mark> B2B partner programs listed in the Partner2B directory on 27 November 2026. Of these, <mark>748</mark> name tiers or partner types. In this report "tiers" means the groups a program names for its partners, whether they are levels or tracks, because most programs mix the two. The method and its limits are at the end.</p>

<h2>Key findings</h2>
<table>
<thead><tr><th>Number</th><th>Finding</th></tr></thead>
<tbody>
<tr><td><mark>42%</mark></td><td>of programs list <mark class="nm">three tiers</mark>, the standard shape (362 of 860)</td></tr>
<tr><td><mark>59%</mark></td><td>list <mark class="nm">three or four</mark> tiers</td></tr>
<tr><td><mark>77%</mark></td><td>of programs that name tiers use <mark class="nm">role names only</mark> (579 of 748)</td></tr>
<tr><td><mark>52%</mark></td><td>use the word <mark class="nm">Technology</mark> in a tier name (389 programs), the most common role word</td></tr>
<tr><td><mark>63</mark> / <mark>56</mark> / <mark>54</mark></td><td>programs use <mark class="nm">Gold</mark>, <mark class="nm">Silver</mark> and <mark class="nm">Platinum</mark>, the most common level names</td></tr>
<tr><td><mark>62%</mark> vs <mark>45%</mark></td><td>of level-only programs publish a commission model, against role-only programs</td></tr>
</tbody>
</table>

<h2>How many tiers do most partner programs have?</h2>
<p>Three. A program with three tiers is the standard shape, and the next most common are four and two. Together, two, three and four tiers cover about three programs in four. Very long ladders are rare.</p>
<img loading="lazy" src="/articles/partner-program-tiers/tier-count.png" alt="Column chart of how many tiers 860 partner programs list: 42% list three, 17% four, 16% two, 13% none, 6% one, 5% five or more" width="1200" height="720">
<table>
<thead><tr><th>Fact</th><th>What it means</th></tr></thead>
<tbody>
<tr><td><mark>42%</mark> of programs list three tiers (362 of 860)</td><td>Three is the standard shape. It is enough to separate partner types or levels and small enough to explain on one page.</td></tr>
<tr><td><mark>17%</mark> list four tiers and <mark>16%</mark> list two</td><td>Four and two are the next most common. With three, they cover about three programs in four.</td></tr>
<tr><td><mark>13%</mark> list no tiers</td><td>About one program in eight gives every partner the same terms, or does not publish its structure.</td></tr>
<tr><td><mark>6%</mark> list one tier</td><td>A single tier is usually one open track, such as a referral or affiliate program, with no levels to climb.</td></tr>
<tr><td><mark>5%</mark> list five or more, and one lists twelve</td><td>Long ladders exist but are rare. Past four, the tiers start to blur into each other.</td></tr>
</tbody>
</table>
<p>The pattern is not surprising once you build a program yourself. Each tier needs its own requirements, its own benefits and someone who manages it. Every extra tier adds work for you and a decision for the partner. Most programs stop at three because the fourth rarely earns its place.</p>

<h2>Do partner programs organise partners by role or by level?</h2>
<p>Mostly by role. Among the <mark>748</mark> programs that name tiers, <mark>579</mark> (<mark>77%</mark>) use role names only, such as Technology Partner, Referral Partner or Reseller Partner. Only <mark>58</mark> (<mark>8%</mark>) use level names only. A further <mark>71</mark> (<mark>9%</mark>) use both, and <mark>40</mark> (<mark>5%</mark>) use names that fit neither pattern.</p>
<img loading="lazy" src="/articles/partner-program-tiers/role-or-level.png" alt="Stacked bar of 748 programs that name tiers: 77% role names only, 8% level names only, 9% both, 5% neither, with examples Shufti, Xero and Stripe" width="1200" height="720">
<table>
<thead><tr><th>Fact</th><th>What it means</th></tr></thead>
<tbody>
<tr><td><mark>77%</mark> name tiers by role only, such as Technology Partner, Referral Partner or Reseller</td><td>Most programs start from what the partner does for them. Each tier answers one question: how do you work with us?</td></tr>
<tr><td><mark>8%</mark> name tiers by level only, such as Silver, Gold and Platinum</td><td>A pure ladder ranks every partner on one scale, so it fits best when all partners do the same job.</td></tr>
<tr><td><mark>9%</mark> use both a role track and a level ladder</td><td>These programs have the most structure. They are also the most likely to mention training, <a href="/glossary/co-marketing">co-marketing</a> funds and <a href="/glossary/deal-registration">deal registration</a>.</td></tr>
<tr><td><mark>5%</mark> use names that fit neither pattern, such as Commercial Partner or Fintech Vendor Partner</td><td>Some programs name tiers after their own market. That works if a partner can tell which tier is theirs at a glance.</td></tr>
</tbody>
</table>
<p>The first thing to decide, then, is not how many tiers but which kind. If your partners do different jobs, such as referring, reselling and integrating, you need tracks. If they all do the same job and differ only in how much they deliver, you need levels. If both are true, you need both.</p>

<h2>What are the most common partner tier names?</h2>
<p>Two vocabularies cover almost every program: role words that say what a partner does, and level words that say how far a partner has come. Both are listed below with the number of programs that use each word.</p>

<h3>Role names: Technology leads, then Reseller</h3>
<p>The word <mark class="nm">Technology</mark> appears in the tier names of <mark>52%</mark> of programs that name tiers (<mark>389</mark> programs). <mark class="nm">Reseller</mark> is next at <mark>26%</mark>. Consulting and Referral are tied at <mark>20%</mark>.</p>
<img loading="lazy" src="/articles/partner-program-tiers/role-names.png" alt="Bar chart of role words in tier names across 748 programs: Technology 52%, Reseller 26%, Consulting 20%, Referral 20%, MSP 14%, Integrator 13%, Channel 13%, Affiliate 10%, Agency 9%, Implementation 7%, Distributor 6%, OEM 4%" width="1200" height="840">
<table>
<thead><tr><th>Role word</th><th>Programs</th><th>Share</th><th>Usually means a partner who</th></tr></thead>
<tbody>
<tr><td><mark class="nm">Technology</mark></td><td><mark>389</mark></td><td><mark>52%</mark></td><td>builds an integration with the vendor's product</td></tr>
<tr><td><mark class="nm">Reseller</mark></td><td><mark>197</mark></td><td><mark>26%</mark></td><td>buys from the vendor and sells to customers</td></tr>
<tr><td><mark class="nm">Consulting</mark></td><td><mark>152</mark></td><td><mark>20%</mark></td><td>advises customers and recommends the product</td></tr>
<tr><td><mark class="nm">Referral</mark></td><td><mark>148</mark></td><td><mark>20%</mark></td><td>introduces customers and is paid for it</td></tr>
<tr><td><mark class="nm">MSP</mark></td><td><mark>102</mark></td><td><mark>14%</mark></td><td>runs the product for customers as a managed service</td></tr>
<tr><td><mark class="nm">Integrator</mark></td><td><mark>98</mark></td><td><mark>13%</mark></td><td>connects the product to the customer's other systems</td></tr>
<tr><td><mark class="nm">Channel</mark></td><td><mark>96</mark></td><td><mark>13%</mark></td><td>sells through indirect routes</td></tr>
<tr><td><mark class="nm">Affiliate</mark></td><td><mark>74</mark></td><td><mark>10%</mark></td><td>promotes the product and earns per sign-up</td></tr>
<tr><td><mark class="nm">Agency</mark></td><td><mark>67</mark></td><td><mark>9%</mark></td><td>uses the product in client work</td></tr>
<tr><td><mark class="nm">Implementation</mark></td><td><mark>54</mark></td><td><mark>7%</mark></td><td>sets up and launches the product for customers</td></tr>
<tr><td><mark class="nm">Distributor</mark></td><td><mark>42</mark></td><td><mark>6%</mark></td><td>buys in volume and supplies resellers</td></tr>
<tr><td><mark class="nm">OEM</mark></td><td><mark>31</mark></td><td><mark>4%</mark></td><td>builds the product into its own offering</td></tr>
</tbody>
</table>
<p>A program can use several of these words, so the shares add up to more than 100%.</p>

<h3>Level names: two families</h3>
<p>Level names come in two families. The metal family runs <mark class="nm">Bronze</mark>, <mark class="nm">Silver</mark>, <mark class="nm">Gold</mark>, <mark class="nm">Platinum</mark>. The standing family runs <mark class="nm">Registered</mark>, <mark class="nm">Select</mark>, <mark class="nm">Premier</mark>, <mark class="nm">Elite</mark>. <mark class="nm">Gold</mark> is the single most common level name, in <mark>63</mark> programs.</p>
<img loading="lazy" src="/articles/partner-program-tiers/level-names.png" alt="Two ladders of level names with program counts. Metal family: Bronze 20, Silver 56, Gold 63, Platinum 54. Standing family: Registered 28, Select 19, Premier 31, Elite 25. 42 programs use Silver, Gold and Platinum together and 11 use all four metals" width="1200" height="860">
<table>
<thead><tr><th>Family</th><th>Names, low to high</th><th>Programs using each name</th></tr></thead>
<tbody>
<tr><td>Metal</td><td><mark class="nm">Bronze</mark>, <mark class="nm">Silver</mark>, <mark class="nm">Gold</mark>, <mark class="nm">Platinum</mark>, <mark class="nm">Diamond</mark></td><td><mark>20</mark>, <mark>56</mark>, <mark>63</mark>, <mark>54</mark>, <mark>12</mark></td></tr>
<tr><td>Standing</td><td><mark class="nm">Registered</mark>, <mark class="nm">Select</mark>, <mark class="nm">Premier</mark>, <mark class="nm">Elite</mark></td><td><mark>28</mark>, <mark>19</mark>, <mark>31</mark>, <mark>25</mark></td></tr>
</tbody>
</table>
<p>Silver, Gold and Platinum all appear together in <mark>42</mark> programs, and Bronze, Silver, Gold and Platinum together in <mark>11</mark>.</p>

<h3>Real tier names from named programs</h3>
<table>
<thead><tr><th>Program</th><th>Tier names</th><th>Kind</th></tr></thead>
<tbody>
<tr><td><mark class="nm">Xero</mark></td><td>Partner, Bronze, Silver, Gold, Platinum</td><td>Levels, metal family</td></tr>
<tr><td><mark class="nm">Snowflake</mark></td><td>Registered, Select, Premier, Elite</td><td>Levels, standing family</td></tr>
<tr><td><mark class="nm">Planful</mark></td><td>Associate, Premier, Elite</td><td>Levels, standing family</td></tr>
<tr><td><mark class="nm">NVIDIA</mark></td><td>Registered, Preferred, Elite, plus partner types</td><td>Both</td></tr>
<tr><td><mark class="nm">Stripe</mark></td><td>Partner and Premier, across four tracks: Services, SaaS platforms, Apps, Payment methods</td><td>Both</td></tr>
<tr><td><mark class="nm">Shufti</mark></td><td>Referrals, Resellers, Affiliates</td><td>Roles</td></tr>
</tbody>
</table>
<p>The lesson is that there is a shared vocabulary. Partners already know what a Silver or a Premier tier means, and they already know what a Referral Partner does. Using the common words saves you a paragraph of explanation on every page.</p>

<h2>Do programs with level names offer more to partners?</h2>
<p>They tend to. Programs that rank partners by level are more likely to publish what partners earn (their <a href="/glossary/partner-commission">commission</a> model) and to fund their marketing.</p>
<table>
<thead><tr><th>Fact</th><th>What it means</th></tr></thead>
<tbody>
<tr><td><mark>62%</mark> of level-only programs publish a commission model, against <mark>45%</mark> of role-only programs</td><td>A ladder only works if partners can see what moving up earns. Role-only programs often leave pay to a sales conversation.</td></tr>
<tr><td><mark>43%</mark> of level-only programs mention co-marketing funds, against <mark>28%</mark> of role-only programs</td><td>Funding is a common reward for reaching a higher level.</td></tr>
<tr><td><mark>60%</mark> of level-only programs mention training, against <mark>49%</mark> of role-only programs</td><td>Training is common in both groups and more common where levels exist.</td></tr>
</tbody>
</table>
<p>Deal registration shows a different pattern. It is almost the same in level-only (<mark>17%</mark>) and role-only (<mark>16%</mark>) programs, and it reaches <mark>28%</mark> in programs that use both. The programs with a role track and a level ladder are the ones most likely to offer it.</p>
<p>Be careful with what this tells you. There are only <mark>58</mark> programs in the level-only group, and a level ladder does not cause a better program. The more likely explanation is that programs that invest in a ladder also invest in the rest. The practical point is simpler: if you add levels, partners will expect to see what each level gets.</p>

<h2>How many tiers should your program have?</h2>
<p>Here is the order I follow when I help a company design this.</p>
<ol>
<li><strong>Start with partner types, not levels.</strong> Write down every way a partner can work with you: refer, resell, integrate, implement, advise. Each way that needs different terms is one track. Most programs need two or three.</li>
<li><strong>Add levels only when you have something to give.</strong> A ladder needs two things: a reason for partners to move up, such as better margin, funds, leads or support, and a result you can measure, such as revenue, certified staff or active customers. Without both, levels are only labels.</li>
<li><strong>Start with two or three levels.</strong> Only <mark>5%</mark> of programs list five or more tiers. Each extra level needs its own benefits, its own requirements and a person to manage it. You can add a level later. Removing one is harder, because partners have already earned it.</li>
<li><strong>Make the first step easy.</strong> The entry tier should be open to any partner that meets a simple standard, with a clear join page. Names such as <mark class="nm">Registered</mark> or <mark class="nm">Associate</mark> tell partners this is the starting point.</li>
<li><strong>Give each tier a benefit the one below does not have.</strong> In our spot check, one program described its top tier in the same words as its entry tier. A partner who reads that has no reason to climb.</li>
<li><strong>Say what each tier gets.</strong> Only <mark>46%</mark> of programs publish how partners are paid. If you publish yours, you stand out. The commission data behind that figure is in <a href="/post/b2b-partner-program-commission-rates">B2B partner program commission rates in 2026</a>.</li>
</ol>

<h2>How should you name your tiers?</h2>
<p>Name tracks for what the partner does. <mark class="nm">Referral Partner</mark>, <mark class="nm">Reseller Partner</mark> and <mark class="nm">Technology Partner</mark> are plain words that partners already use and search for.</p>
<p>Name levels in an order people recognise. <mark class="nm">Silver</mark>, <mark class="nm">Gold</mark> and <mark class="nm">Platinum</mark>, or <mark class="nm">Registered</mark>, <mark class="nm">Select</mark>, <mark class="nm">Premier</mark> and <mark class="nm">Elite</mark>, tell a partner where they stand without an explanation. Pick one family and keep it.</p>
<p>Avoid clever names. A partner should be able to tell which tier is theirs in ten seconds. A name that needs a footnote costs you applications.</p>
<p>Use the same names everywhere. Your program page, your directory listings and your partner portal should all use the same tier names, because directories and AI assistants tend to repeat the names a program uses.</p>

<h2>Method and limits</h2>
<ul>
<li>The numbers are based on public information from the program pages listed in the Partner2B directory on 27 November 2026. They cover <mark>860</mark> programs with filled-in details. The directory lists 1,379 programs. The rest are still being completed and are left out of every figure. Of the 860, <mark>748</mark> name tiers or partner types.</li>
<li>Every listing is marked "not verified". Read the numbers as "based on public information", not as confirmed facts.</li>
<li>The directory records tiers and partner types as each program names them, so levels and tracks are mixed in one field. The split into role names and level names is a keyword match on those names, and it is approximate.</li>
<li>Spot check: we compared the listed tier names of 30 randomly chosen programs with their own program pages. Fifteen matched. Eleven matched in part, because a name was worded differently or one entry was missing or added. Three did not match, or the page had moved. One site could not be reached. Treat each count as approximate.</li>
<li>Programs change their structure. The numbers describe the pages on the date above.</li>
<li>The level-only group has 58 programs, so comparisons with it show a link, not a cause.</li>
<li>Shares are of the programs in the directory, not of all partner programs in the market.</li>
</ul>
<p>We will refresh these numbers as more programs are completed.</p>

<h2>FAQ</h2>
<h3>How many tiers should a partner program have?</h3>
<p>Two or three is the best start. Of the 860 programs we compared, 42% list three tiers and 59% list three or four. Begin with the partner types you need, and add levels once partners have a reason to move up.</p>
<h3>What are typical partner program tier names?</h3>
<p>For roles: Technology Partner, Referral Partner, Reseller Partner, Consulting Partner and Integration Partner. For levels: Silver, Gold and Platinum, or Registered, Select, Premier and Elite.</p>
<h3>What is the difference between a tier and a partner type?</h3>
<p>A partner type, or track, says what the partner does, such as refer, resell or integrate. A tier, or level, says how far the partner has progressed. A program can have both. Stripe has two tiers across four tracks.</p>
<h3>Do I need Silver, Gold and Platinum levels?</h3>
<p>No. Among programs that name tiers, 77% use role names only. Add levels when you can name a reward for each step and a result you can measure.</p>
<h3>How many tiers do large programs have?</h3>
<p>Most large programs list three or four. NVIDIA, for example, has three membership levels and a long list of partner types. A very long list of tiers is rare.</p>
<h2>What to do next</h2>
<p>If you are designing a program, the <a href="/program-builder">Program builder</a> helps you set your partner types and first tiers. To see how other programs name and structure theirs, browse the <a href="/directory">directory</a> and open any listing. If partners sign up and then go quiet, read <a href="/post/why-do-partners-go-quiet-after-signing">why partners go quiet after signing</a>.</p>$article$,
  true
);
commit;
