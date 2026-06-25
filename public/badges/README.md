# Badge images

Each badge in the roadmap looks for an image at `/badges/<item-id>.png` (this folder).

- **Earned** badges render in full colour.
- **Locked** badges render greyed-out.
- If a file is **missing**, the app falls back to the gold hexagon stamp automatically — nothing breaks.

The PNGs here are generic placeholders. To use the real artwork for badges you've
earned, export them from Credly (each badge page has a "Download" option) and replace the
matching file, keeping the **same filename**.

Filenames map to the `id` field in `lib/roadmap.ts`. Current badge ids:

```
m1-packet-tracer        m1-intro-cyber          m1-cyber-fundamentals   m1-digital-world
m2-networking-basics    m2-networking-devices
m3-linux-lfs101         m3-cloud-fundamentals   m3-ai-fundamentals
m4-endpoint-security    m4-cyber-essentials     m4-journey-cloud        m4-aws-ccp
m5-exploring-networking m5-project-mgmt         m5-agile                m5-customer-engagement
```

Square images around 256×256 (transparent background) look best. You can also point a
badge at a custom path by setting `image: "/badges/whatever.png"` on that item in
`lib/roadmap.ts`.
