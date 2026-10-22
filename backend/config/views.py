from django.http import HttpResponse


def home(request):
    return HttpResponse(
        """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CodeLens API</title>
  <style>
    :root { color-scheme: dark; font-family: system-ui, sans-serif; }
    body { align-items: center; background: #0b1020; color: #e5e7eb; display: flex;
      justify-content: center; margin: 0; min-height: 100vh; }
    main { max-width: 680px; padding: 2rem; width: 100%; }
    .card { background: #151c30; border: 1px solid #29334d; border-radius: 18px;
      padding: 2.5rem; }
    .status { color: #86efac; font-size: .9rem; }
    h1 { color: #fff; font-size: clamp(2rem, 7vw, 3.5rem); margin: .5rem 0; }
    p { color: #aab4ca; line-height: 1.6; }
    ul { display: grid; gap: .8rem; list-style: none; padding: 0; }
    a { color: #a5b4fc; text-decoration: none; }
    a:hover { text-decoration: underline; }
    li { background: #0b1020; border-radius: 10px; padding: 1rem; }
    code { color: #cbd5e1; }
  </style>
</head>
<body>
  <main>
    <section class="card">
      <span class="status">● Backend is running</span>
      <h1>CodeLens API</h1>
      <p>The CodeLens Django backend is ready. Open the React app to use the
      platform, or use one of these backend routes:</p>
      <ul>
        <li><a href="/admin/">Admin site</a></li>
        <li><a href="/api/auth/login/">Authentication API</a>
          <span> — POST credentials to log in</span></li>
        <li><a href="/api/auth/register/">Registration API</a></li>
        <li><a href="/api/algorithms/">Algorithms API</a>
          <span> — authentication required</span></li>
        <li><a href="/api/challenges/">Challenges API</a>
          <span> — authentication required</span></li>
        <li><a href="/api/data-structures/">Data Structures API</a>
          <span> — authentication required</span></li>
        <li><a href="/api/progress/">Progress API</a>
          <span> — authentication required</span></li>
        <li><a href="/api/analytics/">Analytics API</a>
          <span> — authentication required</span></li>
        <li><a href="/api/achievements/">Achievements API</a>
          <span> — authentication required</span></li>
        <li><a href="/api/progress/leaderboard/">Leaderboard API</a>
          <span> — authentication required</span></li>
      </ul>
    </section>
  </main>
</body>
</html>"""
    )
