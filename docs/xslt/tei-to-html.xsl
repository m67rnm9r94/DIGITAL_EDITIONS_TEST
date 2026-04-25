<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:tei="http://www.tei-c.org/ns/1.0"
  version="1.0">

  <xsl:output method="html" omit-xml-declaration="yes" indent="yes" />

  <xsl:template match="/">
    <div class="records">
      <xsl:apply-templates select="//tei:event" />
    </div>
  </xsl:template>

  <xsl:template match="tei:event">
    <article class="record" data-id="{substring-after(@xml:id, '')}" data-when="{@when}" data-place="{substring-after(@corresp, '#')}">
      <h3>
        <xsl:value-of select="tei:head" />
      </h3>
      <p class="meta">
        Date: <xsl:value-of select="@when" />
        |
        Place ID: <xsl:value-of select="substring-after(@corresp, '#')" />
      </p>
      <div class="text">
        <xsl:apply-templates select="tei:p/node()" />
      </div>
    </article>
  </xsl:template>

  <xsl:template match="tei:name">
    <span class="mention" data-ref="{substring-after(@ref, '#')}">
      <xsl:value-of select="." />
    </span>
  </xsl:template>

  <xsl:template match="text()">
    <xsl:value-of select="." />
  </xsl:template>
</xsl:stylesheet>
